import axios from "axios";
import React, { useState, useEffect } from "react";
import Clock from "react-clock";
import "./App.css";
import "react-clock/dist/Clock.css";
import { TailSpin } from "react-loader-spinner";

const API_KEY = "ab74b62cf7d069845eee97c51511ef56";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("Bucharest");
  const [time, setTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({});

  function getLonLat() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
          .then((response) => response.json())
          .then((result) => {
            setWeatherData(result);
          })
          .catch((err) => console.log(err));
      });
    }
  }

  useEffect(() => {
    getLonLat();
  }, []);

  useEffect(() => {
    const urlCity = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

    axios.get(urlCity).then((response) => {
      setData(response.data);
    });
  }, [location]);

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      setLocation(event.target.value);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  setTimeout(function () {
    window.location.reload();
    setLocation("");
  }, 50000);

  return (
    <div className="weather_wrapper">
      <div className="search">
        <p>Search new location:</p>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
        />
      </div>

      <div className="weatherCard">
        <div className="currentTemp">
          {data.main ? (
            <span className="temp">{data.main.temp.toFixed()}&deg;</span>
          ) : (
            <div className="tailSpin">
              <TailSpin
                color="#00BFFF"
                height={80}
                width={80}
              />
            </div>
          )}

          <span className="location">{data.name}</span>
          {data.weather ? (
            <span className="sky">{data.weather[0].main} </span>
          ) : null}
        </div>
        <div className="currentWeather">
          <span className="conditions">
            <Clock value={time} />
          </span>
          <div className="info">
            {data.main ? (
              <span className="humidity">{data.main.humidity}% Humidity</span>
            ) : null}

            {data.main ? (
              <span className="wind"> {data.wind.speed} MPH</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="weatherCard">
        <div className="currentTemp">
          {weatherData.main ? (
            <span className="temp">{weatherData.main.temp.toFixed()}&deg;</span>
          ) : (
            <div className="tailSpin">
              <TailSpin
                color="#00BFFF"
                height={80}
                width={80}
              />
            </div>
          )}

          {weatherData.weather ? (
            <span className="sky">{weatherData.weather[0].main} </span>
          ) : null}
          <span className="location">{weatherData.name}</span>
        </div>
        <div className="currentWeather">
          <span className="conditions">
            <Clock value={time} />
          </span>
          <div className="info">
            {weatherData.main ? (
              <span className="humidity">
                {weatherData.main.humidity}% Humidity
              </span>
            ) : null}

            {weatherData.main ? (
              <span className="wind"> {weatherData.wind.speed} MPH</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
