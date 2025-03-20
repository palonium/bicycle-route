import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const validateEmail = () => {
        if (!email) {
            setErrors(prev => ({ ...prev, email: "Пожалуйста, введите почту" }));
            return false;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, email: "Некорректный формат почты" }));
            return false;
        }
        setErrors(prev => ({ ...prev, email: "" }));
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setErrors(prev => ({ ...prev, password: "Пожалуйста, введите пароль" }));
            return false;
        }
        if (password.length < 6) {
            setErrors(prev => ({ ...prev, password: "Пароль должен быть не менее 6 символов" }));
            return false;
        }
        setErrors(prev => ({ ...prev, password: "" }));
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        if (!isEmailValid || !isPasswordValid) return;
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setSubmitError("Неверный логин или пароль");
        }
    };
    

    return (
        <div className="login">
            <div className="container">
                <div className="login__card">
                    <h1 className="login__title">
                        Добро пожаловать обратно.<br />
                        Войдите и начинайте исследовать.
                    </h1>
                    <form onSubmit={handleSubmit} className="login__form">
                        <div className="form-group">
                            <input 
                                type="email" 
                                className={`login__form-input ${errors.email ? "input-error" : ""}`}
                                placeholder="Почта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={validateEmail}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <input 
                                type="password"
                                className={`login__form-input ${errors.password ? "input-error" : ""}`}
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={validatePassword}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <button className="login__form-button" type="submit">Войти</button>
                    </form>
                    <button className="login__button">Забыли пароль?</button>
                    <p className="login__link-text">
                        Нет аккаунта? <a href="/register" className="login__link">Зарегистрироваться</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
