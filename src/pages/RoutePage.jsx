import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import mockRoutes from '../data/mock-routes-data';
import WeatherBlock from '../components/WeatherComponent';
import { UserContext } from '../context/UserContext';
import Reviews from '../components/Reviews';
import BikeRouteMap from '../components/MapComponent';
import RouteCard from '../components/RouteCard';
import '../scss/routepage.scss';

function RoutePage() {
  const { id } = useParams();
  const { addReview } = useContext(UserContext);
  const { user, toggleFavorite } = useContext(UserContext);


  const [route, setRoute] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const openGallery = () => setIsGalleryOpen(true);
  const closeGallery = () => setIsGalleryOpen(false);

  const openMapModal = () => setIsMapModalOpen(true);
  const closeMapModal = () => setIsMapModalOpen(false);

  useEffect(() => {
    const storedRoutes = JSON.parse(localStorage.getItem('routes')) || mockRoutes;
    const foundRoute = storedRoutes.find((r) => r.id === Number(id));
    setRoute(foundRoute);
}, [id]);

const isFavorite = route && user?.favorites?.includes(route.id);


  if (!route) {
    const isFavorite = route && user?.favorites?.includes(route.id);
    return <p>Маршрут не найден</p>;
  }

  const getAverageRating = () => {
    if (!route.reviews || route.reviews.length === 0) return 'Нет оценок';
    const totalRating = route.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return (totalRating / route.reviews.length).toFixed(1);
  };

  const scrollToSection = (sectionId, tabName) => {
    setActiveTab(tabName);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!route) {
    return <p className="route-page__not-found">Маршрут не найден</p>;
  }
  

  return (
    <div className="route-page container">
      <div className="route-page__breadcrumbs">
        <Link to="/filter" className="route-page__back">&larr; Вернуться к списку</Link>
        <span className="route-page__sep"> / </span>
        <Link to="/filter" className="route-page__back">Маршруты</Link>
        <span className="route-page__sep"> / </span>
        <span>{route.name}</span>
      </div>
      <div className="route-page__header">
        <h1 className="route-page__title">{route.name}</h1>
        <div className="route-page__rating-block">
          <img src="/svg/Rating.svg" alt="Рейтинг" />
          <span className="route-page__rating-value">{getAverageRating()}</span>
          ·
          <span className="route-page__rating-count">({route.reviews.length} отзывов)</span>
          ·
          <span className="route-page__difficulty">
            {route.difficulty || 'Легкий'} маршрут
          </span>
        </div>
      </div>

      <div className="route-page__nav">
        <div className="route-page__tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => scrollToSection('overview', 'overview')}
          >
            Обзор
          </button>
          <button
            className={`tab-button ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => scrollToSection('weather', 'weather')}
          >
            Погода
          </button>
          <button
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => scrollToSection('reviews', 'reviews')}
          >
            Отзывы
          </button>
          <button
            className={`tab-button ${activeTab === 'similar' ? 'active' : ''}`}
            onClick={() => scrollToSection('similar', 'similar')}
          >
            Маршруты рядом
          </button>
        </div>
        <div className="route-page__actions">
        <button 
          className="icon-button" 
          title="Добавить в избранное" 
          onClick={() => toggleFavorite(route.id)}
        >
          <img 
            src={isFavorite ? "/svg/favorite-fill.svg" : "/svg/favorite.svg"} 
            alt="Избранное" 
          />
        </button>


          <button className="icon-button" title="Поделиться">
            <img src="/svg/Share.svg" alt="Поделиться" />
          </button>
        </div>
      </div>

      <div id="overview" className="route-page__section">
        <div className="route-page__overview">
          <div className="route-page__media-block">
            <div className="route-page__main-photo-wrap" onClick={openGallery}>
              <img
                src={route.images[0]}
                alt="Основное фото"
                className="route-page__main-photo"
              />
              <div className="route-page__photo-overlay">
                {route.images.length} фото
              </div>
            </div>
            {route.images[1] && (
              <div className="route-page__side-photo-wrap" onClick={openGallery}>
                <img
                  src={route.images[1]}
                  alt="Доп. фото"
                  className="route-page__side-photo"
                />
              </div>
            )}
            <div className="route-page__map-wrap" onClick={openMapModal}>
              <BikeRouteMap selectedRouteId={Number(id)} />
            </div>
          </div>
          <div className="route-page__description-stats">
            <p className="route-page__description">
              {route.description || 'Описание отсутствует...'}
            </p>
            <div className="route-page__stats">
              <div className="stat-block">
                <div className="stat-top">
                  {route.length}
                  <span className="stat-unit">км</span>
                </div>
                <div className="stat-label">Длина</div>
              </div>
              <div className="stat-block">
                <div className="stat-top">
                  {route.duration}
                </div>
                <div className="stat-label">Время маршрута</div>
              </div>
              <div className="stat-block">
                <div className="stat-top">
                  {route.difficulty}
                </div>
                <div className="stat-label">Сложность</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isGalleryOpen && (
        <div className="route-page__gallery-modal">
          <div className="route-page__gallery-content">
            <button className="route-page__gallery-close" onClick={closeGallery}>
              &times;
            </button>
            <div className="route-page__gallery-images">
              {route.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Фото ${idx + 1}`}
                  className="route-page__gallery-img"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {isMapModalOpen && (
        <div className="route-page__map-modal">
          <div className="route-page__map-modal-content">
            <button className="route-page__map-modal-close" onClick={closeMapModal}>
              &times;
            </button>
            <BikeRouteMap selectedRouteId={Number(id)} />
          </div>
        </div>
      )}
      <div id="weather" className="route-page__section">
        <WeatherBlock latitude={route.latitude} longitude={route.longitude} />
      </div>
      <div id="reviews" className="route-page__section">
        <Reviews routeId={route.id} reviews={route.reviews} addReview={addReview} />
      </div>
      <div id="similar" className="route-page__section-routes">
        <h2>Похожие маршруты</h2>
        <div className="route-page__section-cards">
          {mockRoutes.slice(0, 3).map(route => (
              <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoutePage;
