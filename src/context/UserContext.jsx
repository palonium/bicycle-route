import React, { createContext, useState, useEffect } from "react";
import mockRoutes from "../data/mock-routes-data";
import { fetchRoutes } from "../api"; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        // Проверяем, есть ли маршруты в localStorage
        if (!localStorage.getItem("routes")) {
            localStorage.setItem("routes", JSON.stringify(mockRoutes));
        }
    
        fetchRoutes().then(data => setRoutes(data));
    
        const savedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (savedUser) {
            setUser({
                ...savedUser,
                favorites: savedUser.favorites || []
            });
            setIsAuthenticated(true);
        }
    }, []);
    

    const login = async (email, password) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userData = users.find(user => user.email === email && user.password === password);
        
        if (!userData) {
            throw new Error("Неверный логин или пароль");
        }
        
        const updatedUser = { ...userData, favorites: userData.favorites || [] };
        setUser(updatedUser);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    };
    
    

    const register = async (userData) => {
        try {
            let users = JSON.parse(localStorage.getItem("users")) || [];

            if (users.some(user => user.email === userData.email)) {
                throw new Error("Пользователь с таким email уже зарегистрирован.");
            }

            const newUser = { ...userData, favorites: [] }; // Добавляем `favorites`
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            console.log("Регистрация успешна!");
        } catch (error) {
            console.log(error.message);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("currentUser");
    };

    const toggleFavorite = (routeId) => {
        if (!user) {
            console.log("Войдите в аккаунт, чтобы добавлять маршруты в избранное");
            return;
        }

        const updatedFavorites = user.favorites?.includes(routeId)
            ? user.favorites.filter(id => id !== routeId)
            : [...(user.favorites || []), routeId];

        const updatedUser = { ...user, favorites: updatedFavorites };
        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    };

    const addReview = (routeId, newReview) => {
        setRoutes(prevRoutes => {
            const updatedRoutes = prevRoutes.map(route => {
                if (route.id === routeId) {
                    return { ...route, reviews: [...route.reviews, newReview] };
                }
                return route;
            });
    
            localStorage.setItem("routes", JSON.stringify(updatedRoutes));
            return updatedRoutes;
        });
    };
    

    return (
        <UserContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            register, 
            logout, 
            toggleFavorite, 
            addReview,
            routes 
        }}>
            {children}
        </UserContext.Provider>
    );
};
