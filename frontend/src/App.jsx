import React from 'react';
import { BrowserRouter, Routes, Route ,Navigate } from 'react-router-dom';
import Login from './components/forms/Login';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Register from './components/forms/Register';
import { AnimatePresence, motion } from 'framer-motion';

import Dashboard from './components/pages/Dashboard';
import ContactPage from './components/pages/ContactPage';   
import AuthRoute from './components/routes/AuthRoute'
import ProtectedRoute from './components/routes/ProtectedRoute'

const AnimatedRoutes = () => {
  return (
    <AnimatePresence mode="wait">
<Routes>

        <Route 
          path="https://service-provider-chi.vercel.app/login" 
          element={
            {/* <AuthRoute> */}
              <Login />
            {/* </AuthRoute> */}
          } 
        />

        <Route 
          path="https://service-provider-chi.vercel.app/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />

        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </AnimatePresence>
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

