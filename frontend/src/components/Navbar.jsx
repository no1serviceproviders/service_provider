import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToSection = (sectionId) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              GlassFlow
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => scrollToSection('home-section')} className="text-white/80 hover:text-white transition px-3 py-2 text-sm font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection('services-section')} className="text-white/80 hover:text-white transition px-3 py-2 text-sm font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection('contact-section')} className="text-white/80 hover:text-white transition px-3 py-2 text-sm font-medium">
              Contact
            </button>
            {/* Admin Panel Link - Only visible to admin */}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-white/80 hover:text-white transition px-3 py-2 text-sm font-medium">
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-sm transition text-sm font-medium">
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden backdrop-blur-xl bg-black/30 border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => scrollToSection('home-section')} className="block w-full text-left text-white/80 hover:text-white px-3 py-2 text-base font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection('services-section')} className="block w-full text-left text-white/80 hover:text-white px-3 py-2 text-base font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection('contact-section')} className="block w-full text-left text-white/80 hover:text-white px-3 py-2 text-base font-medium">
              Contact
            </button>
            {/* Admin Panel Link - Mobile */}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="block w-full text-left text-white/80 hover:text-white px-3 py-2 text-base font-medium">
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout} className="block w-full text-left text-white/80 hover:text-white px-3 py-2 text-base font-medium">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;