'use client';

import { Droplets, Wind, Eye, Gauge, Navigation, Sun } from 'lucide-react';

interface WeatherData {
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
}

interface WeatherDetailsProps {
  weatherData: WeatherData;
  unit: 'C' | 'F';
  convertTemp: (temp: number) => number;
}

export function WeatherDetails({ weatherData, unit, convertTemp }: WeatherDetailsProps) {
  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-400' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-400' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-400' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-400' };
    return { level: 'Extreme', color: 'text-purple-400' };
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const uv = getUVLevel(weatherData.uvIndex);

  const details = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weatherData.humidity}%`,
      color: 'text-blue-300'
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${weatherData.windSpeed} km/h ${getWindDirection(weatherData.windDirection)}`,
      color: 'text-gray-300'
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weatherData.pressure} hPa`,
      color: 'text-purple-300'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weatherData.visibility} km`,
      color: 'text-indigo-300'
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: `${weatherData.uvIndex} (${uv.level})`,
      color: uv.color
    }
  ];

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-white shadow-2xl border border-white/10">
      <h3 className="text-xl font-bold mb-6">Weather Details</h3>
      <div className="space-y-6">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center justify-between group hover:bg-white/10 rounded-2xl p-3 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <detail.icon className={`w-5 h-5 ${detail.color} group-hover:scale-110 transition-transform`} />
              <span className="font-medium opacity-90">{detail.label}</span>
            </div>
            <span className="font-semibold">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}