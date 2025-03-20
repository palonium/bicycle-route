import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const { register } = useContext(UserContext);

    const validateName = () => {
        if (!name.trim()) {
            setErrors(prev => ({ ...prev, name: "Введите имя" }));
            return false;
        }
        setErrors(prev => ({ ...prev, name: "" }));
        return true;
    };

    const validateEmail = () => {
        if (!email) {
            setErrors(prev => ({ ...prev, email: "Введите почту" }));
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
            setErrors(prev => ({ ...prev, password: "Введите пароль" }));
            return false;
        }
        if (password.length < 6) {
            setErrors(prev => ({ ...prev, password: "Пароль должен быть не менее 6 символов" }));
            return false;
        }
        setErrors(prev => ({ ...prev, password: "" }));
        return true;
    };

    const validateConfirmPassword = () => {
        if (confirmPassword !== password) {
            setErrors(prev => ({ ...prev, confirmPassword: "Пароли не совпадают" }));
            return false;
        }
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmValid = validateConfirmPassword();

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
            return;
        }
        try {
            await register({ name, email, password });
            navigate("/login");
        } catch (err) {
            setErrors(prev => ({ ...prev, email: err.message }));
        }
    };

    return (
        <div className="register">
            <div className="container">
                <div className="register__card">
                    <h1 className="register__title">Регистрация</h1>
                    <form onSubmit={handleRegister} className="register__form">
                        <div className="form-group">
                            <input 
                                type="text" 
                                className={`register__form-input ${errors.name ? "input-error" : ""}`}
                                placeholder="Имя" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                onBlur={validateName}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <input 
                                type="email" 
                                className={`register__form-input ${errors.email ? "input-error" : ""}`}
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
                                className={`register__form-input ${errors.password ? "input-error" : ""}`}
                                placeholder="Пароль" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={validatePassword}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <div className="form-group">
                            <input 
                                type="password" 
                                className={`register__form-input ${errors.confirmPassword ? "input-error" : ""}`}
                                placeholder="Подтвердите пароль" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={validateConfirmPassword}
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                        <button className="register__form-button" type="submit">Зарегистрироваться</button>
                    </form>
                    <p className="register__link-text">
                        Уже есть аккаунт? <a href="/login" className="register__link">Войти</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
