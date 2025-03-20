import React, { useState, useEffect } from 'react';
import '../scss/weather.scss';

const API_KEY = '2c8a02c305a62c641a94cbe087648888';
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

function WeatherBlock({ latitude, longitude }) {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude]);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`);
      const data = await response.json();

      if (data.list) {
        const groupedByDay = data.list.reduce((acc, item) => {
          const dateObj = new Date(item.dt_txt);
          let weekday = dateObj.toLocaleDateString('ru-RU', { weekday: 'long' });
          const day = dateObj.getDate();
          
          weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
          const date = { weekday, day };
          
          if (!acc[date.weekday]) acc[date.weekday] = [];
          acc[date.weekday].push({ ...item, formattedDate: date });
          return acc;
        }, {});

        const formattedWeather = Object.keys(groupedByDay).map((weekday) => {
          const dayData = groupedByDay[weekday].find((item) => item.dt_txt.includes('12:00:00')) || groupedByDay[weekday][0];
          const minTemp = Math.min(...groupedByDay[weekday].map(item => item.main.temp_min));
          const maxTemp = Math.max(...groupedByDay[weekday].map(item => item.main.temp_max));

          return {
            date: groupedByDay[weekday][0].formattedDate,
            temp: Math.round(dayData.main.temp),
            minTemp: Math.round(minTemp),
            maxTemp: Math.round(maxTemp),
            icon: dayData.weather[0].icon,
            description: dayData.weather[0].description,
            humidity: dayData.main.humidity,
            wind: Math.round(dayData.wind.speed),
            pressure: dayData.main.pressure,
            sunrise: new Date(data.city.sunrise * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            sunset: new Date(data.city.sunset * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          };
        });

        setWeatherData(formattedWeather);
        setSelectedDay(formattedWeather[0]);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных о погоде:', error);
    }
  };

  return (
    <div className="weather">
      <h2 className="weather__title">Погода</h2>
      {weatherData.length > 0 ? (
        <>
          <div className="weather__days">
            {weatherData.map((day, index) => (
              <button
                key={index}
                className={`weather__day-btn ${selectedDay?.date.weekday === day.date.weekday ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <span className="weather__day-name">{day.date.weekday}</span>
                <span className="weather__day-number">{day.date.day}</span>
              </button>
            ))}
          </div>

          {selectedDay && (
            <div className="weather__card">
              <div className="weather__temp">{selectedDay.temp}°</div>
              <div className="weather__details">
                <span><img src="../../public/svg/sunrise.svg" alt="" /> {selectedDay.sunrise}</span>
                <span><img src="../../public/svg/sunset.svg" alt="" /> {selectedDay.sunset}</span>
                <span><img src="../../public/svg/humidity.svg" alt="" /> {selectedDay.humidity}%</span>
                <span className="weather__desc">{selectedDay.description}</span>
                <span>H: {selectedDay.maxTemp}°C</span>
                <span>L: {selectedDay.minTemp}°C</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Загрузка погоды...</p>
      )}
    </div>
  );
}

export default WeatherBlock;