import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import TaskForm from "./Pages/Task";
import Navbar from "./components/Navbar";
import UserList from "./Pages/Users";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
                    <Route path="/task-form" element={<><Navbar /><TaskForm /></>} />
                    <Route path="/users" element={<><Navbar /><UserList /></>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
