'use client';

import { useState, useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';

export default function Home() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState({
    address: '',
    lat: '',
    lng: '',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.log('User denied geolocation access', error);
      }
    );
  }, []);

  const handlePlaceSelected = (place) => {
    const { geometry, formatted_address } = place;
    if (geometry) {
      const { lat, lng } = geometry.location;
      setSelectedPlace({
        address: formatted_address,
        lat: lat(),
        lng: lng(),
      });
      setLocation(formatted_address);
    }
  };

  const fetchWeatherData = async (lat, long) => {
    const key = '73f54136beeb4b3995d81105240910';
    if (lat && long) {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${long}&days=7`
        );
        const result = await response.json();
        setWeatherData(result);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  };

  const searchPressed = () => {
    if (selectedPlace.lat && selectedPlace.lng) {
      fetchWeatherData(selectedPlace.lat, selectedPlace.lng);
    }
  };

  const formatDate = (dateString, index) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="flex items-center justify-center mt-8">
        <div className="border-2 w-full sm:w-[50%] p-4 text-center rounded-[20px] bg-gradient-to-r from-blue-100 to-blue-300 shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-gray-700">Weather Detail</h1>
          <Autocomplete
            apiKey="AIzaSyBBGxKE3abRfU_ZsgC6JmiIIUpO5QmaTjI"
            onPlaceSelected={handlePlaceSelected}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-2 rounded-lg w-full p-2 mb-4 outline-none text-gray-600"
            placeholder="Enter a location"
          />
          <button
            onClick={searchPressed}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Check
          </button>

          {/* Current Location Heading */}
          {selectedPlace.address && (
            <h2 className="text-xl font-semibold mt-4 text-gray-700">
              Current Location: {selectedPlace.address}
            </h2>
          )}
        </div>
      </div>
      {weatherData && (
        <div className="mt-6 flex flex-col items-center">
          {weatherData.forecast.forecastday.map((day, index) => (
            <div key={day.date} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-[20px] shadow-xl p-4 w-[90%] sm:w-[50%] mb-4 transition-transform transform hover:scale-105">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">{formatDate(day.date, index)}</h2>
              <div className="text-left">
                <p className="text-lg text-gray-700 mb-2">
                  <strong>Max Temp:</strong> {day.day.maxtemp_c}°C
                </p>
                <p className="text-lg text-gray-700 mb-2">
                  <strong>Min Temp:</strong> {day.day.mintemp_c}°C
                </p>
                <p className="text-lg text-gray-700 mb-2">
                  <strong>Weather:</strong> {day.day.condition.text}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                  <strong>Humidity:</strong> {day.day.avghumidity}%
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Wind Speed:</strong> {day.day.maxwind_kph} kph
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
