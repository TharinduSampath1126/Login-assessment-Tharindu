import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import GitHubLogin from 'react-github-login';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:5000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      
      if (!res.ok) throw new Error('Google authentication failed');
      
      const userData = await res.json();
      const userProfile = { ...userData, provider: 'Google' };
      setUser(userProfile);
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('userData', JSON.stringify(userProfile));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  const handleGitHubSuccess = async (response) => {
    if (!response.code) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:5000/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: response.code })
      });
      
      if (!res.ok) throw new Error('GitHub authentication failed');
      
      const userData = await res.json();
      const userProfile = { 
        name: userData.name || userData.login,
        email: userData.email,
        picture: userData.avatar_url,
        username: userData.login,
        provider: 'GitHub' 
      };
      setUser(userProfile);
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('userData', JSON.stringify(userProfile));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubFailure = (response) => {
    if (response.error === 'user_cancelled_authorize') {
      setError('Login cancelled by user.');
    } else {
      setError('GitHub login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  if (user) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="user-profile">
            <img src={user.picture} alt={user.name} className="profile-picture" />
            <h2>{user.name}</h2>
            {user.username && <p className="user-username">@{user.username}</p>}
            <p className="user-email">{user.email}</p>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Authenticating...</div>}
        <div className="login-buttons">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
          <GitHubLogin
            clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
            onSuccess={handleGitHubSuccess}
            onFailure={handleGitHubFailure}
            redirectUri="http://localhost:3000"
            className="github-button"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
