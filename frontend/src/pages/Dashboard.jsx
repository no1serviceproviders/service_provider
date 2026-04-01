import React from 'react';
import { motion } from 'framer-motion';
import Background from '../components/Background';
<<<<<<< HEAD
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const username = user?.username || user?.name || 'User';
=======
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../components/config/config';


const Dashboard = () => {
>>>>>>> 764e791 (first commit)

  // Service cards data for home section
  const homeServices = [
    { title: 'Website Development', desc: 'Custom responsive websites & PWAs', icon: '🌐' },
    { title: 'SEO Marketing', desc: 'Boost visibility & organic traffic', icon: '📈' },
    { title: 'UI/UX Design', desc: 'Beautiful, intuitive interfaces', icon: '🎨' },
    { title: 'App Development', desc: 'iOS, Android & cross-platform apps', icon: '📱' }
  ];

  // Services section cards data
  const servicesList = [
    { title: 'Full-Stack Engineering', description: 'End-to-end web solutions with modern frameworks.' },
    { title: 'Digital Strategy', description: 'Data-driven marketing campaigns & analytics.' },
    { title: 'Cloud Architecture', description: 'Scalable AWS, Azure & GCP infrastructure.' },
    { title: 'Brand Identity', description: 'Logo design, visual identity & brand guidelines.' },
    { title: 'E-Commerce', description: 'Shopify, WooCommerce & custom stores.' },
    { title: 'Consulting', description: 'Expert guidance for digital transformation.' }
  ];

<<<<<<< HEAD
  const handleLogout = () => {
    logout();
=======
  const handleLogout = async() => {
    await axios.post(`${base_url}/user/logout`,{},{withCredentials:true})
    navigate('/')
>>>>>>> 764e791 (first commit)
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Background variant="professional" /> 

      {/* Custom Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left side: User profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">
<<<<<<< HEAD
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-medium text-sm">{username}</p>
              <p className="text-white/60 text-xs">{user?.email}</p>
=======
                
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-medium text-sm"></p>
              <p className="text-white/60 text-xs"></p>
>>>>>>> 764e791 (first commit)
            </div>
          </div>

          {/* Center: Logo/Company Name */}
          <div className="flex-1 text-center">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              GlassFlow
            </Link>
          </div>

          {/* Right side: Logout button */}
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-sm transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Home Section */}
        <section id="home-section" className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
<<<<<<< HEAD
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Welcome, {username} 👋</h1>
=======
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Welcome, 👋</h1>
>>>>>>> 764e791 (first commit)
            <p className="text-xl text-white/70 mt-2">Explore our premium services crafted for your success</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeServices.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center shadow-xl hover:bg-white/20 cursor-pointer transition-all"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-white/70 text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section id="services-section" className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Services</h2>
            <p className="text-white/70 mt-2">Comprehensive solutions tailored to your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-white/70 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center"
          >
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mb-5 shadow-lg">
              <span className="text-5xl">👤</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Alex Morgan</h3>
            <p className="text-purple-200 mb-4">Lead Developer & Strategist</p>
            <div className="space-y-3 text-white/80">
              <p className="flex items-center justify-center gap-2">📧 alex@glassflow.com</p>
              <p className="flex items-center justify-center gap-2">📞 +1 (555) 123-4567</p>
              <p className="flex items-center justify-center gap-2">📍 San Francisco, CA</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <a href="#" className="text-white/70 hover:text-white transition">🔗 LinkedIn</a>
              <a href="#" className="text-white/70 hover:text-white transition">🐦 Twitter</a>
              <a href="#" className="text-white/70 hover:text-white transition">💻 GitHub</a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto backdrop-blur-xl bg-black/20 border-t border-white/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <div>
              <p>&copy; {new Date().getFullYear()} GlassFlow. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;