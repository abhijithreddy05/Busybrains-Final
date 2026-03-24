import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // 🔐 Normal Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        }
    };

    // 🌐 Google OAuth Login
    const handleGoogleLogin = () => {
        const backendUrl = process.env.REACT_APP_API_URL;

        if (!backendUrl) {
            alert("API URL not configured");
            return;
        }

        window.location.href = `${backendUrl}/oauth2/authorization/google`;
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2>Welcome Back</h2>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Sign In
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-outline w-100 google-btn"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="Google"
                        width="20"
                    />
                    Sign in with Google
                </button>

                <p className="auth-footer mt-3">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>

                <div className="demo-credentials">
                    <strong>Demo Accounts:</strong><br />
                    Admin: admin / password<br />
                    User: user / password
                </div>
            </div>
        </div>
    );
};

export default Login;