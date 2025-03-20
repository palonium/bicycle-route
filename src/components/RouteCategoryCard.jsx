import React from 'react';
import PropTypes from 'prop-types';

function RouteCategoryCard({ image, title }) {
    return (
        <div className="route-category-card">
            <div className="route-category-card__image-box">
                <img src={image} alt={title} className="route-category-card__image" />
                <div className="route-category-card__overlay"></div> 
                <span className="route-category-card__title">{title}</span>
            </div>
        </div>
    );
}

RouteCategoryCard.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default RouteCategoryCard;
