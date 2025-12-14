import './Login.css';

export default function Login() {
  const handleRiotLogin = () => {
    // These will be your actual values after getting production key
    const CLIENT_ID = 'RGAPI-50835c18-ac91-44df-9207-db0761e965f5'; // Replace after getting approved
    const REDIRECT_URI = 'http://localhost:5173/callback';
    const SCOPES = 'openid offline_access';
    
    const authUrl = `https://auth.riotgames.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Valorant Availability</h1>
        <p>Connect your Riot account to set your play status</p>
        <button className="riot-login-btn" onClick={handleRiotLogin}>
          <span>🎮</span>
          Login with Riot Games
        </button>
        <p className="info-text">
          We'll redirect you to Riot's secure login page
        </p>
      </div>
    </div>
  );
}
