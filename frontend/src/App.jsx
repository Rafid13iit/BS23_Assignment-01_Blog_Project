import { Route, Routes, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainWrapper from "../src/layouts/MainWrapper";
import Index from "./views/core/Index";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import EmailVerify from "./views/auth/EmailVerify";
import PrivateRoute from "./layouts/PrivateRoute";
import Dashboard from "./views/dashboard/Dashboard";
import About from "./views/pages/About";
import Contact from "./views/pages/Contact";
import AddPost from "./views/dashboard/AddPost";
import EditPost from "./views/dashboard/EditPost";
import Profile from "./views/dashboard/Profile";

function App() {
    return (
        <>
            <MainWrapper>
                <ToastContainer position="bottom-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify" element={<EmailVerify />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
                    <Route path="/dashboard/add-post" element={<PrivateRoute><AddPost /></PrivateRoute>} />
                    <Route path="/dashboard/edit-post/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
                </Routes>
            </MainWrapper>
        </>
    );
}

export default App;
