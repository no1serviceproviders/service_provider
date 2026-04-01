// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';          // import Login instead of Landing
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './pages/PrivateRoute';
import PublicRoute from './pages/PublicRoute';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    
      <Routes location={location} key={location.pathname}>
        {/* Root path now renders Login */}
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login />
          </motion.div>
        } />
      
        <Route path="/register" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Register />
          </motion.div>
        } />
        <Route path="/admin" element={
    <AdminDashboard />
} />
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

      </Routes>

  );
};

function App() {
  return (
    <BrowserRouter>
        <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
