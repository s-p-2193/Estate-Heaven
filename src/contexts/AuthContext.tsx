import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  firstName: string;
  id: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  avatarColor: string;
  login: (token: string, user: User) => void;
  googleLogin: (user: User) => void; // Add googleLogin method
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarColor, setAvatarColor] = useState('#000');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const googleUserData = localStorage.getItem('googleUser');
    const userData = localStorage.getItem('user');

    // Handle both normal login and Google login
    if (token || googleUserData) {
      try {
        const user = googleUserData ? JSON.parse(googleUserData) : JSON.parse(userData!);
        setIsAuthenticated(true);
        setUserName(user.firstName);
        generateAvatarColor(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const generateAvatarColor = (identifier: string) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6'];
    const colorIndex = Math.floor(Math.random() * colors.length);
    setAvatarColor(colors[colorIndex]);
  };

  const login = (token: string, user: User) => {
    if (!token || !user) {
      console.error('Invalid login data');
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setIsAuthenticated(true);
    setUserName(user.firstName);
    generateAvatarColor(user.id);
  };

  const googleLogin = (user: User) => {
    if (!user) {
      console.error('Invalid Google login data');
      return;
    }

    localStorage.setItem('googleUser', JSON.stringify(user));
    setIsAuthenticated(true);
    setUserName(user.firstName);
    generateAvatarColor(user.id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('googleUser');
    setIsAuthenticated(false);
    setUserName('');
    setAvatarColor('#000');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, avatarColor, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
