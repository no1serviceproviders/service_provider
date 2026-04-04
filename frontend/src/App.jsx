import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/forms/Login';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Register from './components/forms/Register';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    
      <Routes location={location} key={location.pathname}>
        
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path='/register' element={<Register />}/>

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
