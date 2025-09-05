'use client';

import { Droplets, Wind, CloudRain } from 'lucide-react';

interface ForecastData {
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

interface ForecastCardProps {
  forecast: ForecastData;
  unit: 'C' | 'F';
  convertTemp: (temp: number) => number;
}

export function ForecastCard({ forecast, unit, convertTemp }: ForecastCardProps) {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white text-center shadow-xl border border-white/10 hover:bg-white/25 hover:scale-105 transition-all duration-300 group">
      <h4 className="font-semibold mb-3 text-lg">{forecast.date}</h4>
      
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {forecast.icon}
      </div>
      
      <div className="mb-3">
        <div className="flex justify-center items-baseline space-x-1">
          <span className="text-2xl font-bold">{convertTemp(forecast.maxTemp)}°</span>
          <span className="text-lg opacity-70">{convertTemp(forecast.minTemp)}°</span>
        </div>
      </div>
      
      <p className="text-sm opacity-90 mb-4 font-medium">{forecast.condition}</p>
      
      <div className="space-y-2 text-xs opacity-80">
        {forecast.pop > 0 && (
          <div className="flex items-center justify-center space-x-1">
            <CloudRain className="w-3 h-3" />
            <span>{forecast.pop}%</span>
          </div>
        )}
        <div className="flex items-center justify-center space-x-1">
          <Droplets className="w-3 h-3" />
          <span>{forecast.humidity}%</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <Wind className="w-3 h-3" />
          <span>{forecast.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}