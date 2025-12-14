import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Callback({ onLogin }) {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setError('No authorization code received');
      return;
    }

    // Exchange code for tokens via your backend
    exchangeCodeForToken(code);
  }, [searchParams]);

  const exchangeCodeForToken = async (code) => {
    try {
      // This calls your backend endpoint
      const response = await axios.post('http://localhost:3000/api/auth/callback', {
        code: code,
        redirect_uri: 'http://localhost:5173/callback'
      });

      const { access_token, user_data } = response.data;
      
      // Store token
      localStorage.setItem('access_token', access_token);
      
      // Update app state with user data
      onLogin(user_data);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Token exchange failed:', err);
      setError('Failed to authenticate. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="callback-container">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Login</button>
      </div>
    );
  }

  return (
    <div className="callback-container">
      <h2>Authenticating...</h2>
      <p>Please wait while we verify your account</p>
    </div>
  );
}
