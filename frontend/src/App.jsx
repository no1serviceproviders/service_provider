// import React from 'react';
// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import Login from './components/forms/Login';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Register from './components/forms/Register';
// import { AnimatePresence, motion } from 'framer-motion';

// import Dashboard from './components/pages/Dashboard';
// import ContactPage from './components/pages/ContactPage';   
// import AuthRoute from './components/routes/AuthRoute'
// import ProtectedRoute from './components/routes/ProtectedRoute'

// const AnimatedRoutes = () => {
//   const location = useLocation();
//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>

//         <Route 
//           path='/login'
//           element={
//             <AuthRoute>
//               <Login/>
//             </AuthRoute>}
//         />

//         <Route 
//           path='/register'
//           element={
//             <Register/>
//           }
//         />

      
//         <Route
//           path='/'
//           element={
//             <ProtectedRoute>
//               <Dashboard/>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path='/contact'
//           element={
//             <ContactPage/>
//           }
//         />
//       </Routes>
//     </AnimatePresence>
//   );
// };

// function App() {
//   return (
//     <BrowserRouter>
//         <AnimatedRoutes />
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/forms/Login';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Register from './components/forms/Register';
import { AnimatePresence, motion } from 'framer-motion';

import Dashboard from './components/pages/Dashboard';
import ContactPage from './components/pages/ContactPage';   
import AuthRoute from './components/routes/AuthRoute'
import ProtectedRoute from './components/routes/ProtectedRoute'

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
<Routes>

        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />

        <Route 
          path="/register" 
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

