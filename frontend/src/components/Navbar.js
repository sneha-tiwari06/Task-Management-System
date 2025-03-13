import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const role = localStorage.getItem("role"); 

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">Task Manager</Link>
                <div className="navbar-nav">
                {role === "admin" && <Link className="nav-link" to="/task-form">Add Task</Link>}
                {role === "admin" && <Link className="nav-link" to="/register">Register</Link>}
                {role === "admin" && <Link className="nav-link" to="/users">Manage Users</Link>}
                <Link className="nav-link" to="/">Logout</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
