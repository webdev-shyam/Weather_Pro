import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Check if API key is configured
if (!API_KEY) {
  console.error('OpenWeatherMap API key is not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your .env.local file.');
}

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  icon: string;
  description: string;
  sunrise: number;
  sunset: number;
}

export interface ForecastData {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  description: string;
  pop: number; // Probability of precipitation
}

export interface LocationData {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Weather icon mapping from OpenWeatherMap codes to emojis
const getWeatherEmoji = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️',
  };
  return iconMap[iconCode] || '🌤️';
};

// Search for locations
export const searchLocations = async (query: string): Promise<LocationData[]> => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your .env.local file.');
  }

  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });

    return response.data.map((location: any) => ({
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Failed to search locations');
  }
};

// Get current weather by coordinates
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your .env.local file.');
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg || 0,
      pressure: data.main.pressure,
      visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
      uvIndex: 0, // UV index requires separate API call
      feelsLike: Math.round(data.main.feels_like),
      icon: getWeatherEmoji(data.weather[0].icon),
      description: data.weather[0].description,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw new Error('Failed to fetch current weather');
  }
};

// Get UV Index (separate API call)
export const getUVIndex = async (lat: number, lon: number): Promise<number> => {
  if (!API_KEY) {
    console.warn('API key not configured for UV Index');
    return 0;
  }

  try {
    const response = await axios.get(`${BASE_URL}/uvi`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    });
    return Math.round(response.data.value);
  } catch (error) {
    console.error('Error fetching UV index:', error);
    return 0;
  }
};

// Get 5-day forecast
export const getForecast = async (lat: number, lon: number): Promise<ForecastData[]> => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your .env.local file.');
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const forecastList = response.data.list;
    const dailyForecasts: { [key: string]: any[] } = {};

    // Group forecasts by date
    forecastList.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    // Process daily forecasts
    const processedForecasts: ForecastData[] = [];
    const dates = Object.keys(dailyForecasts).slice(0, 5);

    dates.forEach((date, index) => {
      const dayForecasts = dailyForecasts[date];
      const temps = dayForecasts.map((f: any) => f.main.temp);
      const maxTemp = Math.round(Math.max(...temps));
      const minTemp = Math.round(Math.min(...temps));
      
      // Use midday forecast for general conditions
      const middayForecast = dayForecasts[Math.floor(dayForecasts.length / 2)];
      
      const dayName = index === 0 ? 'Today' : 
                     index === 1 ? 'Tomorrow' : 
                     new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

      processedForecasts.push({
        date: dayName,
        maxTemp,
        minTemp,
        condition: middayForecast.weather[0].main,
        icon: getWeatherEmoji(middayForecast.weather[0].icon),
        humidity: middayForecast.main.humidity,
        windSpeed: Math.round(middayForecast.wind.speed * 3.6),
        description: middayForecast.weather[0].description,
        pop: Math.round((middayForecast.pop || 0) * 100),
      });
    });

    return processedForecasts;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw new Error('Failed to fetch forecast');
  }
};

// Get weather by city name
export const getWeatherByCity = async (cityName: string): Promise<{ weather: WeatherData; forecast: ForecastData[] }> => {
  try {
    // First, get coordinates for the city
    const locations = await searchLocations(cityName);
    if (locations.length === 0) {
      throw new Error('City not found');
    }

    const { lat, lon } = locations[0];
    
    // Get current weather and forecast
    const [weather, forecast, uvIndex] = await Promise.all([
      getCurrentWeather(lat, lon),
      getForecast(lat, lon),
      getUVIndex(lat, lon),
    ]);

    weather.uvIndex = uvIndex;

    return { weather, forecast };
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw error;
  }
};

// Get weather by coordinates (for geolocation)
export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<{ weather: WeatherData; forecast: ForecastData[] }> => {
  try {
    const [weather, forecast, uvIndex] = await Promise.all([
      getCurrentWeather(lat, lon),
      getForecast(lat, lon),
      getUVIndex(lat, lon),
    ]);

    weather.uvIndex = uvIndex;

    return { weather, forecast };
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};