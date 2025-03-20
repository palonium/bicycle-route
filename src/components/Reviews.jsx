import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import '../scss/reviews.scss';

const Reviews = ({ routeId, reviews, addReview }) => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(null);
  const [displayCount, setDisplayCount] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prevPhotos) => [
      ...prevPhotos,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removePhoto = (photoUrl) => {
    setPhotos((prev) => prev.filter((p) => p !== photoUrl));
  };

  const handleReviewSubmit = () => {
    if (!user) {
      setErrorMessage("Войдите, чтобы оставить отзыв");
      return;
    }
    if (!rating) {
      setErrorMessage("Пожалуйста, укажите рейтинг");
      return;
    }

    const newReview = {
      user: { name: user.name, avatar: user.avatar },
      rating,
      comment,
      date: new Date().toLocaleDateString(),
      photos,
    };

    addReview(routeId, newReview);

    setLocalReviews((prevReviews) => {
      const updatedReviews = [...prevReviews, newReview];
      const storedRoutes = JSON.parse(localStorage.getItem('routes')) || [];
      const updatedRoutes = storedRoutes.map((route) =>
        route.id === routeId ? { ...route, reviews: updatedReviews } : route
      );
      localStorage.setItem('routes', JSON.stringify(updatedRoutes));
      return updatedReviews;
    });

    setIsModalOpen(false);
    setComment('');
    setRating(0);
    setPhotos([]);
    setErrorMessage("");
  };

  const getAverageRating = () => {
    if (!localReviews.length) return 'Нет оценок';
    const totalRating = localReviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / localReviews.length).toFixed(1);
  };

  const getStarDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    localReviews.forEach((review) => {
      distribution[review.rating] += 1;
    });
    return distribution;
  };

  const filteredReviews = localReviews.filter((review) =>
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSortByRating = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  };

  const sortedFilteredReviews = React.useMemo(() => {
    let sorted = [...filteredReviews];
    if (sortOrder === 'asc') {
      sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === 'desc') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [filteredReviews, sortOrder]);

  const displayedReviews = sortedFilteredReviews.slice(0, displayCount);

  const handleShowMore = () => {
    setDisplayCount((prevCount) => prevCount + 3);
  };

  const starDistribution = getStarDistribution();
  const averageRating = getAverageRating();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`reviews__star ${i <= rating ? 'active' : ''}`}
          onClick={() => setRating(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="reviews">
      <div className="reviews__basic">
        <h2 className="reviews__title">Отзывы</h2>

        <div className="reviews__search">
          <div className="reviews__search-wrapper">
            <img
              className="reviews__search-icon"
              src="/svg/Search.svg"
              alt="Search Icon"
            />
            
            <input
              className="reviews__search-input"
              type="text"
              placeholder="Поиск по отзывам"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button className="reviews__sort-button" onClick={handleSortByRating}>
              <img
                src="/svg/sort.svg"
                alt="Sort Icon"
              />
            </button>
          </div>
        </div>

      </div>

      <div className="reviews__content">
        <div className="reviews__header">
          <div className="reviews__summary">
            <div className="reviews__average">
              <span className="reviews__average-value">{averageRating}</span>
              <span className="reviews__average-stars">
                <img src="../../public/svg/rate-icon.svg" alt="" />
              </span>
            </div>
            <span className="reviews__count">{localReviews.length} отзывов</span>
          </div>
          <div className="reviews__distribution">
            {Object.keys(starDistribution)
              .sort((a, b) => b - a)
              .map((star) => {
                const count = starDistribution[star];
                const percentage = localReviews.length
                  ? (count / localReviews.length) * 100
                  : 0;
                return (
                  <div className="reviews__distribution-row" key={star}>
                    <span className="reviews__distribution-star">
                      {star} <img src="../../public/svg/rate-icon.svg" alt="" />
                    </span>
                    <div className="reviews__distribution-bar">
                      <div
                        className="reviews__distribution-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>

          {user && (
            <button className="reviews__add-button" onClick={() => setIsModalOpen(true)}>
              Оставить отзыв
            </button>
          )}
        </div>

        <ul className="reviews__list">
          {displayedReviews.map((review, index) => (
            <li key={index} className="reviews__item">
              <div className="reviews__item-header">
                <img
                  className="reviews__avatar"
                  src={review.user.avatar}
                  alt={review.user.name}
                />
                <div className="reviews__info">
                  <p className="reviews__user-name">
                    {review.user.name}
                  </p>
                  <p className="reviews__rating-date">
                    <span className="reviews__rating">
                      {[...Array(5)].map((_, idx) => (
                        <img
                          key={idx}
                          src={
                            idx < review.rating
                              ? '/svg/Star-green.svg'
                              : '/svg/Star-grey.svg'
                          }
                          alt="Оценка"
                        />
                      ))}
                    </span>
                    <span className="reviews__date">{review.date}</span>
                  </p>
                </div>
              </div>
              <p className="reviews__comment">{review.comment}</p>
              {review.photos.length > 0 && (
                <div className="reviews__photos">
                  {review.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Фото отзыва"
                      className="reviews__photo"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
          {displayCount < sortedFilteredReviews.length && (
            <button className="reviews__show-more" onClick={handleShowMore}>
              Показать больше
            </button>
          )}
        </ul>
      </div>
      {isModalOpen && (
        <div className="reviews__modal" onClick={() => setIsModalOpen(false)}>
          <div className="reviews__modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="reviews__modal-close" onClick={() => setIsModalOpen(false)}>
              <img src="../../public/svg/close.svg" alt="" />
            </span>

            <h2 className="reviews__modal-title">Оставьте свой комментарий</h2>
            <div className="reviews__stars-wrapper">{renderStars()}</div>
            {errorMessage && <p className="reviews__error-message">{errorMessage}</p>}
            <textarea
              className="reviews__textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="комментарий"
            />

            <div className="reviews__photos-section">
              {photos.length > 0 && (
                <div className="reviews__preview-photos">
                  {photos.map((photo, i) => (
                    <div key={i} className="reviews__preview-photo-wrap">
                      <img
                        src={photo}
                        alt="Предпросмотр"
                        className="reviews__preview-photo"
                      />
                      <button
                        className="reviews__remove-photo"
                        onClick={() => removePhoto(photo)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label htmlFor="photo-upload" className="reviews__photo-add-btn">
                Добавить фото
                <img src="../../public/svg/Cloud_Upload.svg" alt="" />
              </label>
              <input
                id="photo-upload"
                className="reviews__file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              
            </div>

            <button className="reviews__submit-button" onClick={handleReviewSubmit}>
              Отправить комментарий
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
