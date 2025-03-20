export const registerUser = async (userData) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    if (users.some(user => user.email === userData.email)) {
      throw new Error("Пользователь с таким email уже существует");
    }
  
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
  
    return { message: "Регистрация успешна" };
  };
  
  export const loginUser = async (email, password) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === email && user.password === password);
  
    if (!user) throw new Error("Неверный логин или пароль");
  
    localStorage.setItem("currentUser", JSON.stringify(user));
  
    return user;
  };
  
  export const fetchRoutes = async () => {
    return JSON.parse(localStorage.getItem("routes")) || [];
  };
  