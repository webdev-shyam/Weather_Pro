'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { WeatherCard } from '@/components/WeatherCard';
import { ForecastCard } from '@/components/ForecastCard';
import { WeatherDetails } from '@/components/WeatherDetails';
import { LocationSearch } from '@/components/LocationSearch';
import { 
  WeatherData, 
  ForecastData, 
  LocationData, 
  getWeatherByCity, 
  getWeatherByCoordinates 
} from '@/lib/weatherApi';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundClass, setBackgroundClass] = useState('from-blue-400 via-blue-500 to-blue-600');

  const getBackgroundClass = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return 'from-amber-400 via-orange-500 to-red-500';
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
      return 'from-gray-700 via-gray-800 to-gray-900';
    } else if (lowerCondition.includes('cloud')) {
      return 'from-blue-400 via-blue-500 to-blue-600';
    } else if (lowerCondition.includes('snow')) {
      return 'from-blue-100 via-blue-200 to-blue-300';
    }
    return 'from-blue-400 via-blue-500 to-blue-600';
  };

  useEffect(() => {
    if (weatherData) {
      setBackgroundClass(getBackgroundClass(weatherData.condition));
    }
  }, [weatherData]);

  // Load default weather data on component mount
  useEffect(() => {
    loadDefaultWeather();
  }, []);

  const loadDefaultWeather = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { weather, forecast } = await getWeatherByCity('London');
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (error) {
      console.error('Error loading default weather:', error);
      setError('Failed to load weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const convertTemp = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9/5) + 32) : temp;
  };

  const handleLocationSelect = useCallback(async (location: LocationData | 'current') => {
    setIsLoading(true);
    setError(null);

    try {
      let weatherResponse;
      
      if (location === 'current') {
        // Get user's current location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });
        
        weatherResponse = await getWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      } else {
        weatherResponse = await getWeatherByCoordinates(location.lat, location.lon);
      }

      setWeatherData(weatherResponse.weather);
      setForecastData(weatherResponse.forecast);
    } catch (error: any) {
      console.error('Error fetching weather:', error);
      if (error.message.includes('User denied')) {
        setError('Location access denied. Please enable location services or search for a city.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWeatherInsights = (weather: WeatherData | null) => {
    if (!weather) return { recommendation: '', airQuality: '' };

    let recommendation = '';
    let airQuality = 'Air quality data unavailable.';

    // Generate recommendation based on weather conditions
    if (weather.condition.toLowerCase().includes('rain')) {
      recommendation = "Don't forget your umbrella! Indoor activities recommended.";
    } else if (weather.condition.toLowerCase().includes('sunny') || weather.condition.toLowerCase().includes('clear')) {
      if (weather.uvIndex > 6) {
        recommendation = "Great weather for outdoor activities! UV index is high, so don't forget sunscreen.";
      } else {
        recommendation = "Perfect weather for outdoor activities! UV index is moderate.";
      }
    } else if (weather.condition.toLowerCase().includes('cloud')) {
      recommendation = "Good weather for outdoor activities. No need for sunscreen today.";
    } else if (weather.condition.toLowerCase().includes('snow')) {
      recommendation = "Bundle up! Perfect weather for winter activities.";
    } else {
      recommendation = "Check current conditions before heading out.";
    }

    // Simple air quality estimation based on visibility
    if (weather.visibility >= 10) {
      airQuality = "Air quality is good. Perfect for outdoor activities.";
    } else if (weather.visibility >= 5) {
      airQuality = "Air quality is moderate. Outdoor activities are generally safe.";
    } else {
      airQuality = "Air quality may be poor. Consider limiting outdoor activities.";
    }

    return { recommendation, airQuality };
  };

  const insights = getWeatherInsights(weatherData);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} transition-all duration-1000 ease-in-out`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">WeatherPro</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-2 flex">
              <button
                onClick={() => setUnit('C')}
                className={`px-4 py-2 rounded-full text-white font-medium transition-all ${
                  unit === 'C' ? 'bg-white/30 shadow-lg' : 'hover:bg-white/10'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('F')}
                className={`px-4 py-2 rounded-full text-white font-medium transition-all ${
                  unit === 'F' ? 'bg-white/30 shadow-lg' : 'hover:bg-white/10'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        {/* Main Weather Display */}
        {error && (
          <div className="mb-8 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-4 text-white">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <WeatherCard 
                weatherData={weatherData} 
                unit={unit} 
                convertTemp={convertTemp}
                isLoading={isLoading}
              />
            </div>
            <div>
              <WeatherDetails 
                weatherData={weatherData} 
                unit={unit} 
                convertTemp={convertTemp}
              />
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecastData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">5-Day Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecastData.map((forecast, index) => (
                <ForecastCard 
                  key={index} 
                  forecast={forecast} 
                  unit={unit} 
                  convertTemp={convertTemp}
                />
              ))}
            </div>
          </div>
        )}

        {/* Weather Insights */}
        {weatherData && (
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Weather Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="bg-white/10 rounded-2xl p-4">
                <h4 className="font-semibold mb-2">Today's Recommendation</h4>
                <p className="text-sm opacity-90">
                  {insights.recommendation}
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <h4 className="font-semibold mb-2">Air Quality</h4>
                <p className="text-sm opacity-90">
                  {insights.airQuality}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !weatherData && (
          <div className="flex items-center justify-center py-20">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading weather data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}