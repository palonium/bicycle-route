import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import RoutePage from "./pages/RoutePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FilterPage from "./pages/FilterPage"; // Добавляем FilterPage
import Footer from "./components/Footer";
import "./scss/style.scss";

function App() {
    return (
        <UserProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/route/:id" element={<RoutePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/filter" element={<FilterPage />} /> {/* Добавлен маршрут */}
                </Routes>
                <Footer/>
            </Router>
        </UserProvider>
    );
}

export default App;
