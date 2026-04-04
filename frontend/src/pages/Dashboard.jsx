import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '../components/Background';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const username = user?.username || user?.name || 'User';
  const userEmail = user?.email || 'user@example.com';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  // Mock purchased services (replace with data from your backend)
  const purchasedServices = [
    { id: 1, name: 'Web Development - Premium Package', date: '2025-02-15', status: 'Active' },
    { id: 2, name: 'SEO Marketing - Quarterly Plan', date: '2025-03-01', status: 'Active' },
    { id: 3, name: 'AI Integration Consulting', date: '2025-01-10', status: 'Completed' }
  ];

  const companyDetails = {
    name: 'SkyBridge Digital',
    founded: '2023',
    description: 'We help startups launch, scale, and dominate with cutting-edge web, mobile, and marketing solutions.',
    email: 'hello@skybridge.digital',
    phone: '+1 (888) 789-0123',
    address: 'Austin, TX / Remote'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutsideDrawer = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && isProfileDrawerOpen) {
        setIsProfileDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => document.removeEventListener('mousedown', handleClickOutsideDrawer);
  }, [isProfileDrawerOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileDrawerOpen(true);
    setIsDropdownOpen(false);
  };

  const handleServiceClick = () => {
    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    setIsDropdownOpen(false);
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const drawerVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { x: '100%', transition: { duration: 0.3 } }
  };

  // Data for cards (unchanged)
  const homeServices = [
    { title: 'Web Development', desc: 'Modern, scalable websites & web apps', icon: '🌐' },
    { title: 'App Development', desc: 'iOS, Android & cross‑platform solutions', icon: '📱' },
    { title: 'Growth Marketing', desc: 'Data‑driven user acquisition & SEO', icon: '📈' },
    { title: 'AI Integration', desc: 'Smart chatbots, analytics & automation', icon: '🤖' }
  ];

  const servicesList = [
    { title: 'SaaS Development', description: 'Build subscription‑based platforms with recurring revenue models.' },
    { title: 'MVP Launchpad', description: 'Rapid prototyping and market‑ready MVPs for startups.' },
    { title: 'SEO & Content Marketing', description: 'Rank higher, attract investors, and convert users.' },
    { title: 'Social Media Growth', description: 'Organic & paid strategies for TikTok, IG, LinkedIn, and X.' },
    { title: 'Cloud Infrastructure', description: 'Scalable AWS, Firebase, or Vercel setups for startups.' },
    { title: 'Startup Consulting', description: 'Go‑to‑market strategy, pitch decks, and investor relations.' }
  ];

  const teamMembers = [
    {
      name: 'Dr. Suriya Priyadharsini M',
      role: 'Founder & CEO',
      image: '/team/suriya.jpg',
      bio: 'Visionary leader with 10+ years in digital innovation and startup growth.'
    },
    {
      name: 'Aravinth T',
      role: 'Lead Full Stack Developer',
      image: '/team/aravinth.jpg',
      bio: 'Expert in scalable web apps, cloud systems, and backend architecture.'
    },
    {
      name: 'Loganathan V',
      role: 'Frontend Engineer',
      image: '/team/loganathan.jpg',
      bio: 'Specialist in UI/UX design, animations, and modern web experiences.'
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <Background variant="professional" />

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20 py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
              SkyBridge Digital
            </span>
          </Link>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group py-1 px-2 rounded-lg active:bg-white/10"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden xs:block text-right">
                <p className="text-white font-medium text-xs sm:text-sm">{username}</p>
                <p className="text-white/60 text-[10px] sm:text-xs hidden sm:block">{userEmail}</p>
              </div>
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 sm:w-48 backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl shadow-2xl overflow-hidden z-30"
                >
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 text-white text-sm sm:text-base hover:bg-white/20 transition flex items-center gap-3"
                  >
                    <span>👤</span> Profile
                  </button>
                  <button
                    onClick={handleServiceClick}
                    className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 text-white text-sm sm:text-base hover:bg-white/20 transition flex items-center gap-3"
                  >
                    <span>⚙️</span> Services
                  </button>
                  <hr className="border-white/20" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 text-white text-sm sm:text-base hover:bg-white/20 transition flex items-center gap-3"
                  >
                    <span>🚪</span> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Profile Drawer (integrated, no separate file) */}
      <AnimatePresence>
        {isProfileDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-full sm:w-1/2 lg:w-2/5 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl z-50 border-l border-white/20 overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                {/* Close button */}
                <button
                  onClick={() => setIsProfileDrawerOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
                  aria-label="Close"
                >
                  ✕
                </button>

                {/* User Info */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg mb-4">
                    <span className="text-white text-3xl font-bold">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{username}</h2>
                  <p className="text-white/60 text-sm">{userEmail}</p>
                </div>

                {/* Purchased Services */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📦</span> Services You’ve Bought
                  </h3>
                  {purchasedServices.length === 0 ? (
                    <p className="text-white/60 text-sm">No services purchased yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {purchasedServices.map((service) => (
                        <div
                          key={service.id}
                          className="bg-white/10 rounded-xl p-4 border border-white/20"
                        >
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <p className="text-white font-medium text-sm sm:text-base">{service.name}</p>
                              <p className="text-white/50 text-xs">Purchased: {service.date}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              service.status === 'Active' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-gray-500/20 text-gray-300'
                            }`}>
                              {service.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Company Details */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🏢</span> About {companyDetails.name}
                  </h3>
                  <div className="bg-white/10 rounded-xl p-5 space-y-3">
                    <p className="text-white/80 text-sm leading-relaxed">
                      {companyDetails.description}
                    </p>
                    <div className="pt-3 border-t border-white/20">
                      <p className="text-white/70 text-sm flex items-center gap-2 flex-wrap">
                        <span>📧</span> {companyDetails.email}
                      </p>
                      <p className="text-white/70 text-sm flex items-center gap-2 mt-2 flex-wrap">
                        <span>📞</span> {companyDetails.phone}
                      </p>
                      <p className="text-white/70 text-sm flex items-center gap-2 mt-2 flex-wrap">
                        <span>📍</span> {companyDetails.address}
                      </p>
                      <p className="text-white/70 text-sm flex items-center gap-2 mt-2">
                        <span>📅</span> Founded {companyDetails.founded}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="min-h-[90vh] sm:min-h-screen flex items-center justify-center px-4 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              Welcome, {username}
            </h1>
            <p className="mt-6 text-xl sm:text-3xl font-semibold bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
              SkyBridge Digital — Turning Ideas into Revenue & Growth
            </p>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              We help startups launch faster, scale smarter, and dominate their market.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="px-5 py-2.5 sm:px-8 sm:py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition text-sm sm:text-base"
              >
                Start Your Project
              </Link>
              <Link
                to="/services"
                className="px-5 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition text-sm sm:text-base"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Services Cards */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                What We Offer
              </h2>
              <p className="text-white/60 mt-3 text-sm sm:text-lg max-w-xl mx-auto">
                Startup-ready solutions designed to help you launch, scale, and dominate your market.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{ scale: 1.06, rotate: 1 }}
                  className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 text-center shadow-[0_0_30px_rgba(14,165,233,0.15)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative z-10 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-2xl shadow-lg group-hover:scale-110 transition">
                    {service.icon}
                  </div>
                  <h3 className="relative z-10 text-lg sm:text-xl font-semibold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="relative z-10 text-white/60 text-sm leading-relaxed">
                    {service.desc}
                  </p>
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-b-3xl"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-center">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Why Startups Choose SkyBridge</h2>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                  We’re not just an agency – we’re a launch partner. From your first line of code to your first 10,000 users,  
                  we provide the technical firepower and marketing engine that early‑stage companies need to succeed.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-sky-300">50+</div>
                    <div className="text-white/70 text-xs sm:text-sm">Startups Launched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-sky-300">$100M+</div>
                    <div className="text-white/70 text-xs sm:text-sm">Client Funding Raised</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-sky-300">4.9★</div>
                    <div className="text-white/70 text-xs sm:text-sm">Client Satisfaction</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-5xl sm:text-6xl md:text-7xl shadow-2xl">
                  🚀
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Detailed Services Section */}
        <section id="services-section" className="py-12 sm:py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Our Core Expertise</h2>
              <p className="text-white/70 mt-2 text-sm sm:text-base">Tailored for startups, scale‑ups, and innovators</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {servicesList.map((service, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:bg-white/20"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{service.title}</h3>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Meet the Team
              </h2>
              <p className="text-white/60 mt-3">
                The people behind SkyBridge Digital 🚀
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="relative group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(14,165,233,0.2)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] transition-all duration-300"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white/20 shadow-lg group-hover:scale-110 transition"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 blur-xl opacity-30 group-hover:opacity-60 transition"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-sky-400 text-sm font-medium mt-1">
                    {member.role}
                  </p>
                  <p className="text-white/60 text-sm mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-b-3xl"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10 items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_0_60px_rgba(14,165,233,0.2)] p-8 md:p-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Let’s Build Something Great 🚀
              </h2>
              <p className="text-white/70 mt-4 text-sm sm:text-lg">
                Partner with <span className="text-sky-400 font-semibold">SkyBridge Digital</span> to turn your ideas into scalable, revenue-generating products.
              </p>
              <div className="mt-6 space-y-3 text-white/80 text-sm sm:text-base">
                <p>✅ Fast MVP Development</p>
                <p>✅ Scalable Architecture</p>
                <p>✅ Growth-Focused Strategy</p>
              </div>
              <div className="mt-6 space-y-2 text-white/70 text-sm">
                <p>📧  no1serviceproviders@gmail.com</p>
                <p>📞 +91 96296 96474</p>
                <p>📍 Trichy</p>
              </div>
              <div className="flex gap-5 mt-6 text-white/70">
                <a href="#" className="hover:text-sky-400 transition">LinkedIn</a>
                <a href="#" className="hover:text-sky-400 transition">X</a>
                <a href="#" className="hover:text-sky-400 transition">Instagram</a>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-white/20 rounded-3xl p-8 text-center shadow-xl"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg mb-5">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">
                Start Your Project Today
              </h3>
              <p className="text-white/70 mt-3 text-sm">
                Get a free consultation and roadmap for your startup idea.
              </p>
              <Link
                to="/contact"
                className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl text-white font-semibold shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all duration-300"
              >
                Book Free Consultation
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto backdrop-blur-xl bg-black/20 border-t border-white/20 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-white/60 text-xs sm:text-sm">
            <div>
              <p>&copy; {new Date().getFullYear()} SkyBridge Digital. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Startup Resources</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
