import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import mockRouteCategories from "../data/mock-route-categories";
import ProfileModal from "./ProfileModal"; // Импортируем модальное окно

function Header() {
    const { isAuthenticated, user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isTransparent, setIsTransparent] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        setIsTransparent(location.pathname === "/");
    }, [location]);

    const handleCategoryClick = (category) => {
        navigate(`/filter?type=${encodeURIComponent(category)}`);
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        window.location.reload();
    };
    return (
        <>
            <header className="header header--transparent">
                <a href="/" className="header__logo-wrap">
                    <img src="/logo/logo.svg" alt="Логотип" className="header__logo" />
                </a>

                <div className="header__items">
                    <div 
                        className="header__nav-dropdown"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <span className="header__nav-dropdown-label">Каталог маршрутов <img src="../../public/svg/chevron.svg" alt="" className="header__nav-dropdown-icon" /></span>
                        {isDropdownOpen && (
                            <ul className="header__nav-dropdown-menu">
                                {mockRouteCategories.map((category) => (
                                    <li key={category.id} onClick={() => handleCategoryClick(category.title)}>
                                        {category.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="header__auth">
                        {isAuthenticated && user ? (
                            <div className="header__user" onClick={() => setIsProfileOpen(true)}>
                                <span className="header__user-name">{user.name}</span>
                                <img src={user.avatar} alt="Аватар" className="header__user-avatar" />
                                <button onClick={handleLogout} className="header__logout-button">
                                    <img src="../../public/svg/Log_out.svg" alt="" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button className="header__register-button" onClick={() => navigate("/register")}>Зарегистрироваться</button>
                                <button className="header__login-button" onClick={() => navigate("/login")}>Войти</button>
                            </>
                        )}
                    </div>
                </div>
            </header>
            {isProfileOpen && <ProfileModal user={user} onClose={() => setIsProfileOpen(false)} />}
        </>
    );
}

export default Header;
