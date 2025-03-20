import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RouteCard from '../components/RouteCard';
import { fetchRoutes } from '../api'; 
import "../scss/filter.scss";

const FilterPage = () => {
  const [searchParams] = useSearchParams();
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [routeType, setRouteType] = useState(searchParams.get("type") || "Любой");
  const [coverageType, setCoverageType] = useState("Любой");
  const [distance, setDistance] = useState([0, 100]); 
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || null);

  useEffect(() => {
    fetchRoutes().then(data => setRoutes(data));
  }, []);

  useEffect(() => {
    setFilteredRoutes(routes.filter(route => 
      (routeType === "Любой" || route.type === routeType) &&
      (coverageType === "Любой" || route.surface === coverageType) &&
      (route.length >= distance[0] && route.length <= distance[1]) &&
      (!difficulty || route.difficulty === difficulty)
    ));
  }, [routes, routeType, coverageType, distance, difficulty]);

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value < distance[1]) {
      setDistance([value, distance[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value > distance[0] && value <= 100) {
      setDistance([distance[0], value]);
    }
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level === difficulty ? null : level);
  };

  const handleClearFilter = () => {
    setRouteType("Любой");
    setCoverageType("Любой");
    setDistance([0, 100]);
    setDifficulty(null);
  };

  return (
    <div className="filter-page">
      <nav className="filter-page__breadcrumbs">
        <span>Главная</span> / <span>Вело-маршруты</span>
      </nav>

      <h1 className="filter-page__title">Исследуйте маршруты</h1>

      <div className="filter-page__bar">
        <div className="filter-page__item">
          <label htmlFor="routeType" className="filter-page__label">Тип маршрута</label>
          <select 
            id="routeType" 
            className="filter-page__select" 
            value={routeType} 
            onChange={(e) => setRouteType(e.target.value)}
          >
            <option value="Любой">Любой</option>
            <option value="Городские">Городские</option>
            <option value="Культурно-исторические">Культурно-исторические</option>
            <option value="Семейные">Семейные</option>
            <option value="Спортивные">Спортивные</option>
            <option value="Лесные">Лесные</option>
            <option value="Пешеходно-велосипедные">Пешеходно-велосипедные</option>
            <option value="Пригородные">Пригородные</option>
            <option value="Ночные">Ночные</option>
            <option value="Туристические">Туристические</option>
          </select>
        </div>

        <div className="filter-page__item">
          <label htmlFor="coverageType" className="filter-page__label">Тип покрытия</label>
          <select 
            id="coverageType" 
            className="filter-page__select" 
            value={coverageType} 
            onChange={(e) => setCoverageType(e.target.value)}
          >
            <option value="Любой">Любой</option>
            <option value="Асфальт">Асфальт</option>
            <option value="Грунт">Грунт</option>
            <option value="Смешанное">Смешанное</option>
          </select>
        </div>

        <div className="filter-page__item filter-page__item--range">
          <label className="filter-page__label">Длина, км</label>
          <div className="filter-page__range-values">
            <span> от </span>
            <input 
              type="number" 
              className="filter-page__input" 
              value={distance[0]} 
              onChange={handleMinChange}
              min="0" 
              max={distance[1] - 1}
            />
            <span> — </span>
            <span> до </span>
            <input 
              type="number" 
              className="filter-page__input" 
              value={distance[1]} 
              onChange={handleMaxChange}
              min={distance[0] + 1} 
              max="100"
            />
          </div>

          <div className="filter-page__range">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={distance[0]} 
              onChange={handleMinChange} 
              className="filter-page__range-input"
            />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={distance[1]} 
              onChange={handleMaxChange} 
              className="filter-page__range-input"
            />
          </div>
        </div>

        <div className="filter-page__item filter-page__item--difficulty">
          <label className="filter-page__label">Сложность</label>
          <div className="filter-page__difficulty-buttons">
            {["Лёгкий", "Средний", "Сложный"].map(level => (
              <button 
                key={level} 
                type="button" 
                className={`filter-page__difficulty-btn ${difficulty === level ? "filter-page__difficulty-btn--active" : ""}`} 
                onClick={() => handleDifficultySelect(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-page__summary">
        <p className="filter-page__count">Найдено {filteredRoutes.length} маршрутов</p>
        <button className="filter-page__clear" onClick={handleClearFilter}><img src="../../public/svg/close.svg" alt="" /> Очистить фильтр</button>
      </div>

      <div className="filter-page__routes">
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map(route => <RouteCard key={route.id} route={route} />)
        ) : (
          <p className="filter-page__no-routes">Маршруты не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
