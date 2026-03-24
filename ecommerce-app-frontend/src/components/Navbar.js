import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="ama-navbar">
            <div className="ama-nav-top">
                <Link to="/" className="ama-brand">
                    <span className="ama-logo">Store<span className="ama-logo-dot">.</span></span>
                </Link>
                
                <div className="ama-search-container">
                    <select className="ama-search-category"><option>All</option></select>
                    <input type="text" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} className="ama-search-input" />
                    <button className="ama-search-btn">🔍</button>
                </div>

                <div className="ama-nav-right">
                    {user ? (
                        <>
                            <Link to="/profile" className="ama-nav-item" style={{textDecoration: 'none'}}>
                                <span className="ama-nav-line-1">Hello, {user.username}</span>
                                <span className="ama-nav-line-2">Account & Lists</span>
                            </Link>
                            
                            {user.role === 'ROLE_ADMIN' && (
                                <div className="ama-nav-item">
                                    <span className="ama-nav-line-1">Admin</span>
                                    <span className="ama-nav-line-2">Dashboard</span>
                                </div>
                            )}

                            <div className="ama-nav-item" onClick={handleLogout} style={{cursor: 'pointer'}}>
                                <span className="ama-nav-line-1">Sign Out</span>
                                <span className="ama-nav-line-2">Leave</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="ama-nav-item" style={{textDecoration: 'none'}}>
                                <span className="ama-nav-line-1">Hello, sign in</span>
                                <span className="ama-nav-line-2">Account & Lists</span>
                            </Link>
                        </>
                    )}
                    <div className="ama-nav-item ama-cart">
                        <span className="ama-cart-count">0</span>
                        <span className="ama-nav-line-2">Cart</span>
                    </div>
                </div>
            </div>
            <div className="ama-nav-bottom">
                <Link to="/">All</Link>
                <Link to="/">Today's Deals</Link>
                <Link to="/">Customer Service</Link>
                <Link to="/">Registry</Link>
                <Link to="/">Gift Cards</Link>
                <Link to="/">Sell</Link>
            </div>
        </nav>
    );
};

export default Navbar;
