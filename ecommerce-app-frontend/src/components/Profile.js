import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Auth.css'; // Reuse auth card styles

const Profile = () => {
    const [profile, setProfile] = useState({ username: '', email: '', role: '' });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        api.get('/profile').then(res => setProfile(res.data)).catch(err => console.error(err));
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.put('/profile', { username: profile.username, email: profile.email });
            setError(false);
            setMessage('Profile updated successfully');
        } catch (err) {
            setError(true);
            setMessage(err.response?.data || 'Failed to update profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.put('/profile/change-password', passwords);
            setError(false);
            setMessage('Password changed successfully');
            setPasswords({ oldPassword: '', newPassword: '' });
        } catch (err) {
            setError(true);
            setMessage(err.response?.data || 'Failed to change password');
        }
    };

    return (
        <div className="auth-container" style={{flexDirection: 'column', gap: '2rem', padding: '2rem 0'}}>
            <h1 style={{textAlign: 'center'}}>Account Settings</h1>
            {message && <div style={{width: '100%', maxWidth: '500px'}} className={error ? "alert-error" : "alert-success"}>{message}</div>}
            
            <div className="card" style={{width: '100%', maxWidth: '500px'}}>
                <h3>Profile Information</h3>
                <form onSubmit={handleProfileUpdate} style={{marginTop: '1.5rem'}}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input type="text" className="form-control" value={profile.role} disabled style={{opacity: 0.6}} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-3">Save Profile</button>
                </form>
            </div>

            <div className="card" style={{width: '100%', maxWidth: '500px'}}>
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} style={{marginTop: '1.5rem'}}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" className="form-control" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" className="form-control" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-3">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
