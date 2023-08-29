import React, { useState, useEffect } from 'react';
import './WeatherApp.css';

import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import humidity_icon from "../Assets/humidity.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";

const WeatherApp = () => {

    let api_key = "dfc7c287379ecd0f6e54df4bdfd933fe";

    const [wicon, setWicon] = useState(cloud_icon);
    const [error, setError] = useState(null);  // New state for error messages

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    const showPosition = (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
    }

    const showError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    const getWeatherByCoords = async (lat, lon) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
        updateWeatherData(url);
    }

    const search = async () => {
        const element = document.getElementsByClassName("CityInput");
        if (element[0].value === "") {
            return;
        }
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=metric&appid=${api_key}`;
        updateWeatherData(url);
    }

    const updateWeatherData = async (url) => {
        let response = await fetch(url);
        if (!response.ok) {
            setError('City not found. Please try a different city.');
            return;
        }
        let data = await response.json();
        setError(null);
        const humidity = document.getElementsByClassName("humidity-percent");
        const wind = document.getElementsByClassName("wind-rate");
        const temprature = document.getElementsByClassName("weather-temp");
        const location = document.getElementsByClassName("weather-location");

        humidity[0].innerHTML = Math.round(data.main.humidity) + " %";
        wind[0].innerHTML = data.wind.speed + " km/hr";
        temprature[0].innerHTML = Math.round(data.main.temp) + "&deg;C";
        location[0].innerHTML = data.name;

        if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
            setWicon(clear_icon);
        }
        else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
            setWicon(cloud_icon);
        }
        else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
            setWicon(drizzle_icon);
        }
        else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
            setWicon(rain_icon);
        }
        else if (data.weather[0].icon === "05d" || data.weather[0].icon === "05n") {
            setWicon(snow_icon);
        }
        else {
            setWicon(clear_icon);
        }
    }
    return (
        <div className='container'>
            <div className="top-bar">
                <input type="text" className="CityInput" placeholder='Search' />
                <div className="search-icon" onClick={() => { search() }}>
                    <img src={search_icon} alt="search_icon" />
                </div>
            </div>
            <div className="error-message">{error}</div> {/* Display the error message */}
            <div className="weather-image">
                <img src={wicon} alt="weather_icon" />
            </div>
            <div className="weather-temp">--&deg;C</div>
            <div className="weather-location">- - - - - -</div>
            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt="" className='icon' />
                    <div className="data">
                        <div className="humidity-percent">--%</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={wind_icon} alt="" className='icon' />
                    <div className="data">
                        <div className="wind-rate">-- km/hr</div>
                        <div className="text">Wind Speed</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default WeatherApp;