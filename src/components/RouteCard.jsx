import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function RouteCard({ route }) {
    const navigate = useNavigate();
    const { user, toggleFavorite } = useContext(UserContext);

    const isFavorite = user?.favorites?.includes(route.id) || false;

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); 
        if (user) {
            toggleFavorite(route.id);
        } else {
            alert("Войдите в аккаунт, чтобы добавлять маршруты в избранное");
        }
    };

    const getAverageRating = () => {
        if (!route.reviews || route.reviews.length === 0) return "Нет отзывов";
        const totalRating = route.reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / route.reviews.length).toFixed(1);
    };

    return (
        <article className="route-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/route/${route.id}`)}>
            <div className="route-card__image-wrap">
                <img src={route.images[0]} alt={route.name} className="route-card__image" />
                <button 
                    className={`route-card__favorite ${isFavorite ? "active" : ""}`} 
                    onClick={handleFavoriteClick}
                >
                    <img src={isFavorite ? "/svg/favorite-fill.svg" : "/svg/favorite.svg"} alt="Избранное" />
                </button>
            </div>
            <div className="route-card__content">
                <h3 className="route-card__title">{route.name}</h3>
                <p className="route-card__info">
                    <img src="/svg/rate-icon.svg" alt="Рейтинг" /> 
                    {getAverageRating()} · {route.difficulty} · {route.length} км · {route.duration}
                </p>
            </div>
        </article>
    );
}

RouteCard.propTypes = {
    route: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        difficulty: PropTypes.string.isRequired,
        length: PropTypes.number.isRequired,
        duration: PropTypes.string.isRequired,
        reviews: PropTypes.arrayOf(
            PropTypes.shape({
                rating: PropTypes.number.isRequired
            })
        ).isRequired
    }).isRequired
};

export default RouteCard;
