'use client';

import { MapPin, Thermometer } from 'lucide-react';

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

interface WeatherCardProps {
  weatherData: WeatherData;
  unit: 'C' | 'F';
  convertTemp: (temp: number) => number;
  isLoading: boolean;
}

export function WeatherCard({ weatherData, unit, convertTemp, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-white animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-white/20 rounded w-48"></div>
          <div className="h-16 w-16 bg-white/20 rounded-full"></div>
        </div>
        <div className="h-20 bg-white/20 rounded w-32 mb-4"></div>
        <div className="h-6 bg-white/20 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-white shadow-2xl border border-white/10 hover:bg-white/25 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 opacity-80" />
          <span className="text-lg font-medium">{weatherData.location}, {weatherData.country}</span>
        </div>
        <div className="text-6xl animate-bounce">{weatherData.icon}</div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-7xl font-light">{convertTemp(weatherData.temperature)}</span>
          <span className="text-3xl font-light opacity-80">°{unit}</span>
        </div>
        <p className="text-xl opacity-90 mt-2">{weatherData.condition}</p>
      </div>

      <div className="flex items-center space-x-2 text-sm opacity-80">
        <Thermometer className="w-4 h-4" />
        <span>Feels like {convertTemp(weatherData.feelsLike)}°{unit}</span>
      </div>
    </div>
  );
}