'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchLocations, LocationData } from '@/lib/weatherApi';

interface LocationSearchProps {
  onLocationSelect: (location: LocationData | 'current') => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length > 2) {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const locations = await searchLocations(query);
          setSuggestions(locations);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error searching locations:', error);
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleLocationSelect = (location: LocationData) => {
    setIsSearching(true);
    onLocationSelect(location);
    setQuery('');
    setShowSuggestions(false);
    setTimeout(() => setIsSearching(false), 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleLocationSelect(suggestions[0]);
    }
  };

  const getCurrentLocation = () => {
    setIsSearching(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          onLocationSelect('current');
          setTimeout(() => setIsSearching(false), 1500);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsSearching(false);
        }
      );
    }
  };

  return (
    <div className="relative">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
            />
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl z-10">
              {suggestions.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 first:rounded-t-2xl last:rounded-b-2xl transition-all duration-200 flex items-center space-x-2"
                  >
                    <MapPin className="w-4 h-4 opacity-60" />
                    <div className="flex flex-col">
                      <span>{location.name}</span>
                      <span className="text-xs opacity-70">
                        {location.state ? `${location.state}, ` : ''}{location.country}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
        
        <button
          onClick={getCurrentLocation}
          disabled={isSearching}
          className="px-6 py-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </div>
    </div>
  );
}