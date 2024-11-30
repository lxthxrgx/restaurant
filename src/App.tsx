import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import './App.css';
import Menu from './pages/Menu';

function Home() {
    return <h1>Welcome to the Home Page</h1>;
}

function App() {
    return (
        <Router>
            <div className="App">
                <header className="navbar">
                    <nav className="navbar-container">
                        <ul className="navbar-list">
                            <li className="navbar-item">
                                <Link to="/" className="navbar-link">Home</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/menu" className="navbar-link">Menu</Link>
                            </li>
                        </ul>
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
