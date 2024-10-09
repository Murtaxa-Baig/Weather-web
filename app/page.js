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

  // UseEffect to get user's current location if they allow it
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
    const key = '2319db5d5fab225d5c9d6cd5a01b577c';
    if (lat && long) {
      try {
        await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metric`
        )
          .then((res) => res.json())
          .then((result) => {
            setWeatherData(result);
          });
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
        </div>
      </div>
      {
        weatherData && (
          <div className="mt-6 flex justify-center">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-[20px] shadow-xl p-6 w-[90%] sm:w-[50%] transition-transform transform hover:scale-105">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">{weatherData.name}</h2>
              <div className="text-left">
                <p className="text-lg text-gray-700 mb-2"><strong>Temperature:</strong> {weatherData.main.temp}°C</p>
                <p className="text-lg text-gray-700 mb-2"><strong>Weather:</strong> {weatherData.weather[0].description}</p>
                <p className="text-lg text-gray-700 mb-2"><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
                <p className="text-lg text-gray-700"><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
