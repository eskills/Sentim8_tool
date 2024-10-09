import { useState, useEffect } from 'react';

// Mock user data (replace with actual storage mechanism in production)
const MOCK_USER = { id: '1', name: 'J Smith', email: 'user@example.com', package: 'free' };

// Add these constants at the top of the file
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const MICROSOFT_CLIENT_ID = 'YOUR_MICROSOFT_CLIENT_ID';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., by checking localStorage)
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);

    // Load Google API
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication logic
    if (email === MOCK_USER.email && password === 'password') {
      setUser(MOCK_USER);
      localStorage.setItem('user', JSON.stringify(MOCK_USER));
      document.cookie = `authToken=${MOCK_USER.id}; path=/; max-age=86400;`;
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (name: string, email: string, password: string, package_: string) => {
    // Mock registration logic
    const newUser = { id: Date.now().toString(), name, email, package: package_ };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    document.cookie = `authToken=${newUser.id}; path=/; max-age=86400;`;
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const loginWithGoogle = () => {
    return new Promise((resolve) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (response) => {
          if (response.access_token) {
            const userInfo = await fetchGoogleUserInfo(response.access_token);
            setUser(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
            document.cookie = `authToken=${userInfo.id}; path=/; max-age=86400;`;
            resolve({ success: true });
          } else {
            resolve({ success: false, error: 'Google authentication failed' });
          }
        },
      });
      client.requestAccessToken();
    });
  };

  const loginWithMicrosoft = () => {
    const msalConfig = {
      auth: {
        clientId: MICROSOFT_CLIENT_ID,
        redirectUri: window.location.origin,
      },
    };
    const msalInstance = new msal.PublicClientApplication(msalConfig);
    
    return msalInstance.loginPopup({
      scopes: ['user.read'],
    }).then((response) => {
      if (response.account) {
        const userInfo = {
          id: response.account.homeAccountId,
          name: response.account.name,
          email: response.account.username,
          package: 'free', // Default package for social logins
        };
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        document.cookie = `authToken=${userInfo.id}; path=/; max-age=86400;`;
        return { success: true };
      }
      return { success: false, error: 'Microsoft authentication failed' };
    }).catch((error) => {
      return { success: false, error: error.message };
    });
  };

  return { user, loading, login, register, logout, loginWithGoogle, loginWithMicrosoft, setUser };
}

async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return {
    id: data.sub,
    name: data.name,
    email: data.email,
    package: 'free', // Default package for social logins
  };
}