import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import RouteCard from "../components/RouteCard";
import { fetchRoutes } from "../api";

function ProfileModal({ onClose }) {
  const { user, setUser, logout, toggleFavorite } = useContext(UserContext);

  const [favoriteRoutes, setFavoriteRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState("account");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user?.favorites?.length) {
      fetchRoutes().then(data => {
        const filteredRoutes = data.filter(route => user.favorites.includes(route.id));
        setFavoriteRoutes(filteredRoutes);
      });
    }
  }, [user]);

  const handleSave = () => {
    const updatedUser = { ...user, name: editedName, email: editedEmail };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditingName(false);
    setIsEditingEmail(false);
  };

  const handlePasswordSave = () => {
    setPasswordError("");

    if (!newPassword || !confirmPassword) {
      setPasswordError("Пожалуйста, заполните оба поля для нового пароля.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают. Попробуйте еще раз.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Пароль должен содержать минимум 6 символов.");
      return;
    }

    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map(u => (u.email === user.email ? { ...u, password: newPassword } : u));
    localStorage.setItem("users", JSON.stringify(users));
    setUser(updatedUser);
    setNewPassword("");
    setConfirmPassword("");
    setIsEditingPassword(false);
  };

  return (
    <div className="modal">
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>
          <img src="../../public/svg/close.svg" alt="Закрыть" />
        </button>
        <h2 className="modal__title">Настройки</h2>

        <div className="modal__tabs">
          <button
            className={`modal__tab ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Учётная запись
          </button>
          <button
            className={`modal__tab ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            Избранные маршруты
          </button>
        </div>

        {activeTab === "account" ? (
          <div className="modal__profile">
            <div className="modal__avatar-box">
              <img src={user.avatar} alt="Аватар" className="modal__avatar" />
            </div>
            <div className="modal__info">
              <label>Имя</label>
              <div className="modal__input-group">
                {isEditingName ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  <span>{user.name}</span>
                )}
                <button
                  className="modal__edit-button"
                  onClick={() => setIsEditingName(!isEditingName)}
                >
                  <img src="../../public/svg/edit.svg" alt="Редактировать" />
                </button>
              </div>

              <label>Почта</label>
              <div className="modal__input-group">
                {isEditingEmail ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                ) : (
                  <span>{user.email}</span>
                )}
                <button
                  className="modal__edit-button"
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                >
                  <img src="../../public/svg/edit.svg" alt="Редактировать" />
                </button>
              </div>
              <button 
                className="modal__password-button" 
                onClick={() => setIsEditingPassword(!isEditingPassword)}
              >
                Изменить пароль
              </button>
              {isEditingPassword && (
                <div className="modal__password-section">
                  <label>Новый пароль</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label>Подтвердите новый пароль</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {passwordError && <p className="error">{passwordError}</p>}
                  <button 
                    className="modal__save-button" 
                    onClick={handlePasswordSave}
                  >
                    Сохранить пароль
                  </button>
                </div>
              )}
            </div>
            <button className="modal__save-button" onClick={handleSave}>
              Сохранить изменения
            </button>
          </div>
        ) : (
          <div className="modal__favorites">
            {favoriteRoutes.length > 0 ? (
              favoriteRoutes.map((route) => (
                <div key={route.id} className="modal__favorite-item">
                  <RouteCard route={route} />
                </div>
              ))
            ) : (
              <p>Нет избранных маршрутов</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
