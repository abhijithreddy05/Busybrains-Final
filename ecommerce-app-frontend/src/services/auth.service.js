import api from './api';

class AuthService {
    login(username, password) {
        return api
            .post('/auth/login', {
                username,
                password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    localStorage.setItem('token', response.data.token);
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    register(username, email, password) {
        return api.post('/auth/register', {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
}

const authService = new AuthService();
export default authService;
