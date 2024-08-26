'use client';

import { useState } from "react";
import Autocomplete from "react-google-autocomplete";

export default function Home() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null)




  console.log("weather data is ...", weatherData);

  const [selectedPlace, setSelectedPlace] = useState({
    address: '',
    lat: '',
    lng: ''
  });

  const handlePlaceSelected = (place) => {
    const { geometry, formatted_address } = place;
    if (geometry) {
      const { lat, lng } = geometry.location;

      setSelectedPlace({
        address: formatted_address,
        lat: lat(),
        lng: lng(),
      });

      setLocation(formatted_address);  // Set location to formatted address
    }
  };



  const searchPressed = async () => {
    // setIsLoading(true);
    try {
      const lat = selectedPlace.lat
      const long = selectedPlace.lng
      const key = "2319db5d5fab225d5c9d6cd5a01b577c"
      if (lat && long) {
        await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metric`
        )
          .then((res) => res.json())
          .then((result) => {
            setWeatherData(result);
            // setIsLoading(false);

          });
      }
    } catch (error) {
      // setIsLoading(false);
      console.error("Error fetching user location:", error);
    }
  };


  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div data-aos="zoom-in" className="border-2 w-full sm:w-[50%] p-4 text-center rounded-[20px]">
          <h1 className="text-3xl font-bold">Weather Detail</h1>
          <Autocomplete
            apiKey="AIzaSyBBGxKE3abRfU_ZsgC6JmiIIUpO5QmaTjI"
            onPlaceSelected={handlePlaceSelected}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-2 rounded-[5px] px-1 outline-none"
          />
          <button onClick={searchPressed}>Check</button>
          <div className="mt-4">
            <p><strong>Selected Address:</strong> {selectedPlace.address}</p>
          </div>
        </div>
      </div>
    </>
  );
}
