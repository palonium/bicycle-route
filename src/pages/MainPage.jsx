import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteCard from "../components/RouteCard";
import RouteCategoryCard from "../components/RouteCategoryCard";
import mockRoutes from "../data/mock-routes-data";
import mockRouteCategories from "../data/mock-route-categories";

function MainPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRoutes = mockRoutes.filter(route => 
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="main main--with-background">
            <section className="search-route">
                <h1 className="search-route__title">Найдите свой маршрут</h1>
                <div className="search-route__form">
                    <button className="search-route__button">
                        <span className="search-route__icon"></span>
                    </button>
                    <input 
                        className="search-route__input" 
                        type="text" 
                        placeholder="Поиск маршрута..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>
            </section>

            {searchQuery.trim() ? (
                <section className="search-results container">
                    <h2 className="search-results__title">Результаты поиска</h2>
                    <div className="search-results__routes cards">
                        {filteredRoutes.length > 0 ? (
                            filteredRoutes.map(route => (
                                <RouteCard key={route.id} route={route} />
                            ))
                        ) : (
                            <p className="search-results__no-results">Маршруты не найдены.</p>
                        )}
                    </div>
                </section>
            ) : (
                <>
                    <section className="popular container">
                        <div className="popular__info">
                            <h1 className="popular__title title">Популярные маршруты</h1>
                            <button className="popular__show-button button" onClick={() => navigate("/filter")}>Посмотреть все</button>
                        </div>
                        <div className="popular__routes cards">
                            {mockRoutes.slice(0, 3).map(route => (
                                <RouteCard key={route.id} route={route} />
                            ))}
                        </div>
                    </section>

                    <section className="route-categories container">
                        <h1 className="route-categories__title title">Выбери свой маршрут</h1>
                        <div className="route-categories__grid cards">
                            {mockRouteCategories.map(category => (
                                <div 
                                    key={category.id} 
                                    className="route-category-card-wrapper"
                                    onClick={() => navigate(`/filter?type=${encodeURIComponent(category.title)}`)}
                                >
                                    <RouteCategoryCard image={category.image} title={category.title} />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="complexity container">
                        <h2 className="complexity__title title">Для любого уровня сложности</h2>
                        <div className="complexity__buttons">
                            <button className="complexity__button" onClick={() => navigate(`/filter?difficulty=Лёгкий`)}>Лёгкий</button>
                            <button className="complexity__button" onClick={() => navigate(`/filter?difficulty=Средний`)}>Средний</button>
                            <button className="complexity__button" onClick={() => navigate(`/filter?difficulty=Сложный`)}>Сложный</button>
                        </div>
                        <div className="complexity__routes cards">
                            {mockRoutes.slice(0, 6).map(route => (
                                <RouteCard key={route.id} route={route} />
                            ))}
                        </div>
                        <button className="complexity__show-button button" onClick={() => navigate("/filter")}>Посмотреть все</button>
                    </section>
                </>
            )}
        </main>
    );
}

export default MainPage;
