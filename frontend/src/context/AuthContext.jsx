import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginUser, signupUser } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mealToken');
    if (token) {
      getProfile()
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem('mealToken');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (payload, isAdminLogin = false) => {
    const data = await loginUser(payload);
    
    // Check if admin login is required but user is not admin
    if (isAdminLogin && !data.isAdmin) {
      throw new Error('You are not Admin');
    }
    
    localStorage.setItem('mealToken', data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin });
    return data;
  };

  const signup = async (payload) => {
    const data = await signupUser(payload);
    localStorage.setItem('mealToken', data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mealToken');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
