import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[[]/, '\\[').replace(/[\\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');

        if (token) {
            // Since our backend generates a JWT on successful OAuth login, 
            // we decode it or fetch the user profile if needed.
            // But because we only return a token string right now, we can decode the token or mock other details.
            
            try {
                const decoded = jwtDecode(token);
                // The Spring Boot JWT contains username in sub
                const userData = {
                    token: token,
                    username: decoded.sub,
                    role: 'ROLE_USER' // Default for OAuth unless handled specifically
                };

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                
                navigate('/');
            } catch (err) {
                console.error("Invalid Token", err);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [location, navigate, setUser]);

    return (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
            <h2>Authenticating...</h2>
        </div>
    );
};

export default OAuth2RedirectHandler;
