// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load users from localStorage or initialize
  const loadUsers = () => {
    const storedUsers = localStorage.getItem('glassUsers');
    if (!storedUsers) {
      // Create default admin user
      const defaultUsers = [
        {
          id: 1,
          email: 'admin@example.com',
          password: 'admin123',
          approved: true,
          role: 'admin',
          username: 'Admin',
          companyName: 'Admin Corp',
          phone: '0000000000',
          place: 'Admin City',
          district: 'Admin District',
          pincode: '000000',
          service: 'web', // or 'marketing'
          paymentMethod: 'upi',
          upiId: 'admin@okhdfcbank',
          address: 'Admin Address'
        }
      ];
      localStorage.setItem('glassUsers', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(storedUsers);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('glassCurrentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = loadUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      if (!foundUser.approved && foundUser.role !== 'admin') {
        throw new Error('Your account is pending approval by admin.');
      }
      setUser(foundUser);
      localStorage.setItem('glassCurrentUser', JSON.stringify(foundUser));
      return foundUser;
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = (userData) => {
    const users = loadUsers();
    const newId = users.length + 1;
    const newUser = {
      id: newId,
      ...userData,
      approved: false,   // pending approval
      role: 'user',
    };
    users.push(newUser);
    localStorage.setItem('glassUsers', JSON.stringify(users));
    // Do not auto-login; user must wait for approval.
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('glassCurrentUser');
  };

  // Admin functions
  const getAllUsers = () => {
    return loadUsers();
  };

  const approveUser = (userId) => {
    const users = loadUsers();
    const updated = users.map(u => u.id === userId ? { ...u, approved: true } : u);
    localStorage.setItem('glassUsers', JSON.stringify(updated));
    // If the current user is being approved, update session
    if (user && user.id === userId) {
      const updatedUser = updated.find(u => u.id === userId);
      setUser(updatedUser);
      localStorage.setItem('glassCurrentUser', JSON.stringify(updatedUser));
    }
  };

  const rejectUser = (userId) => {
    const users = loadUsers();
    const updated = users.filter(u => u.id !== userId);
    localStorage.setItem('glassUsers', JSON.stringify(updated));
    // If the current user is being rejected, log them out
    if (user && user.id === userId) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAllUsers, approveUser, rejectUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);