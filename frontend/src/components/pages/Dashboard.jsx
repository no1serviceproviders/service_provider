import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // User editable profile
  const [username, setUsername] = useState(user?.username || user?.name || 'Client');
  const [userEmail, setUserEmail] = useState(user?.email || 'client@example.com');
  const [userPhone, setUserPhone] = useState(user?.phone || '+1 (555) 123-4567');
  const [userPassword, setUserPassword] = useState('');

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isProjectsDrawerOpen, setIsProjectsDrawerOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [locationStr, setLocationStr] = useState('Detecting location...');
  const [chatMessage, setChatMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { from: 'support', text: '👋 Hi! How can we help with your project?', timestamp: new Date() }
  ]);
  const chatEndRef = useRef(null);
  
  // Meeting request modal state
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    link: ''
  });

  // Scroll blur effect – starts at 10px, fades to 0 by 400px
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const blurIntensity = Math.max(0, 10 - (scrollY / 40));

  // Mock data
  const [stats, setStats] = useState({
    activeProjects: 3,
    completedProjects: 7,
    pendingInvoices: 2,
    upcomingDeadlines: 1
  });

  const [projects, setProjects] = useState([
    { id: 1, name: 'E‑commerce Web App', client: 'Client', status: 'In Development', progress: 65, dueDate: '2025-05-15', lastUpdate: '2025-04-10' },
    { id: 2, name: 'AI Resume Screener', client: 'Student', status: 'Review', progress: 90, dueDate: '2025-04-20', lastUpdate: '2025-04-12' },
    { id: 3, name: 'Portfolio Website', client: 'Student', status: 'Completed', progress: 100, dueDate: '2025-03-30', lastUpdate: '2025-03-28' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Project "E‑commerce App" milestone reached!', read: false, time: '2 hours ago' },
    { id: 2, message: 'New invoice #INV-1023 available', read: false, time: '1 day ago' },
    { id: 3, message: 'Meeting scheduled for Apr 18', read: true, time: '3 days ago' }
  ]);

  const [invoices, setInvoices] = useState([
    { id: 'INV-101', amount: '$2,500', dueDate: '2025-04-30', status: 'Unpaid', project: 'E‑commerce App' },
    { id: 'INV-102', amount: '$450', dueDate: '2025-04-15', status: 'Paid', project: 'AI Resume Screener' },
    { id: 'INV-103', amount: '$200', dueDate: '2025-04-10', status: 'Paid', project: 'Portfolio Website' }
  ]);

  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Project Kickoff - E‑commerce', date: '2025-04-18', time: '11:00 AM', link: 'https://meet.google.com/xxx' }
  ]);

  const referralLink = `https://skybridge.com/ref/${Math.random().toString(36).substring(2, 10)}`;

  // Last login
  const [lastLogin, setLastLogin] = useState(() => {
    const stored = localStorage.getItem('lastLogin');
    if (stored) return stored;
    const now = new Date().toLocaleString();
    localStorage.setItem('lastLogin', now);
    return now;
  });

  // Refs for scroll
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const servicesRef = useRef(null);
  const drawerRef = useRef(null);
  const projectsDrawerRef = useRef(null);
  const notificationRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Location detection
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationStr(`📍 ${latitude.toFixed(2)}, ${longitude.toFixed(2)} (approx.)`);
        },
        () => setLocationStr('📍 Location not granted — using default: Austin, TX')
      );
    } else {
      setLocationStr('📍 Geolocation not supported — default: New York, NY');
    }
  }, [isProfileDrawerOpen]);

  // Close drawers on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && isProfileDrawerOpen) {
        setIsProfileDrawerOpen(false);
        setIsEditingProfile(false);
      }
      if (projectsDrawerRef.current && !projectsDrawerRef.current.contains(event.target) && isProjectsDrawerOpen) {
        setIsProjectsDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDrawerOpen, isProjectsDrawerOpen]);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutsideNotif = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target) && showNotifications) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideNotif);
    return () => document.removeEventListener('mousedown', handleClickOutsideNotif);
  }, [showNotifications]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileDrawerOpen(false);
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMobileMenuOpen(false);
  };

  const openProfileDrawer = () => {
    setIsProfileDrawerOpen(true);
    setIsMobileMenuOpen(false);
    setIsEditingProfile(false);
  };

  const openProjectsDrawer = () => {
    setIsProjectsDrawerOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleEditProfile = () => setIsEditingProfile(true);
  const handleSaveProfile = () => {
    alert('Profile updated successfully! (Demo)');
    setIsEditingProfile(false);
  };
  const handleCancelEdit = () => {
    setUsername(user?.username || user?.name || 'Client');
    setUserEmail(user?.email || 'client@example.com');
    setUserPhone(user?.phone || '+1 (555) 123-4567');
    setUserPassword('');
    setIsEditingProfile(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    const newMessage = { from: 'user', text: chatMessage, timestamp: new Date() };
    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, { from: 'support', text: 'Thanks for reaching out! Our team will respond shortly.', timestamp: new Date() }]);
    }, 1500);
  };

  const handleFileUpload = () => {
    alert(`File uploaded for project: ${selectedProject?.name} (Demo)`);
    setShowUploadModal(false);
    setSelectedProject(null);
  };

  // Meeting request handlers
  const handleRequestMeeting = () => {
    setShowMeetingModal(true);
    setIsProjectsDrawerOpen(false);
  };

  const handleMeetingSubmit = (e) => {
    e.preventDefault();
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      alert('Please fill in all required fields');
      return;
    }
    const meetingLink = newMeeting.link || 'https://meet.google.com/xxx';
    const newId = meetings.length + 1;
    setMeetings(prev => [...prev, { 
      id: newId, 
      title: newMeeting.title, 
      date: newMeeting.date, 
      time: newMeeting.time, 
      link: meetingLink 
    }]);
    setNotifications(prev => [{
      id: Date.now(),
      message: `New meeting scheduled: ${newMeeting.title} on ${newMeeting.date}`,
      read: false,
      time: 'Just now'
    }, ...prev]);
    setNewMeeting({ title: '', date: '', time: '', link: '' });
    setShowMeetingModal(false);
    alert('Meeting requested successfully! We will confirm shortly.');
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
  };
  const drawerVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { x: '100%', transition: { duration: 0.3 } }
  };
  const leftDrawerVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { x: '-100%', transition: { duration: 0.3 } }
  };

  // Data arrays
  const homeServices = [
    { title: 'Client Projects', desc: 'Full‑cycle development for startups & businesses', icon: '🏢' },
    { title: 'Student Projects', desc: 'Guidance & execution for academic & portfolio work', icon: '🎓' },
    { title: 'Security Audits', desc: 'Code reviews, penetration testing & compliance', icon: '🔒' },
    { title: 'Trusted Workflow', desc: 'Transparent milestones & weekly updates', icon: '✅' }
  ];

  const servicesList = [
    { title: 'Web & Mobile Development', description: 'Custom websites, PWAs, React Native apps with secure backends.' },
    { title: 'Student Project Mentorship', description: 'From idea to submission – we help you build standout projects.' },
    { title: 'DevOps & Cloud Setup', description: 'AWS, Vercel, Docker – scalable infrastructure for any project.' },
    { title: 'Security Hardening', description: 'Data encryption, secure auth, GDPR compliance, and vulnerability fixes.' },
    { title: 'UI/UX Design', description: 'User‑centric interfaces that impress professors and clients alike.' },
    { title: 'Maintenance & Support', description: 'Post‑launch monitoring, bug fixes, and server management.' }
  ];

  const teamMembers = [
    { name: 'Dr. Suriya Priyadharsini M', role: 'Lead Architect', image: '/team/suriya.jpg', bio: 'secure software architecture & client delivery.' },
    { name: 'Aravinth T', role: ' Full Stack Developer', image: '/team/aravinth.jpg', bio: 'Expert in scalable apps, cloud systems, and student mentorship.' },
    { name: 'Loganathan V', role: 'Frontend & Security Specialist', image: '/team/loganathan.jpg', bio: 'Specializes in modern frameworks and secure coding practices.' }
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Fixed Background Image with dynamic blur overlay */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Corporate background"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 bg-black/60 transition-all duration-100"
          style={{ backdropFilter: `blur(${blurIntensity}px)` }}
        ></div>
      </div>

      {/* Header - increased height */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20 py-4 sm:py-5">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 z-10">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
              SkyBridge Digital
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                <span className="text-2xl">🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-30">
                    <div className="p-2 border-b border-white/20">
                      <h4 className="text-white font-semibold">Notifications</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-3 border-b border-white/10 cursor-pointer ${!n.read ? 'bg-white/10' : ''}`}>
                          <p className="text-white text-sm">{n.message}</p>
                          <p className="text-white/40 text-xs mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection(heroRef)} className="text-white/80 hover:text-white transition text-sm font-medium">Home</button>
              <button onClick={openProjectsDrawer} className="text-white/80 hover:text-white transition text-sm font-medium">Projects</button>
              <button onClick={() => scrollToSection(aboutRef)} className="text-white/80 hover:text-white transition text-sm font-medium">About</button>
              <button onClick={openProfileDrawer} className="text-white/80 hover:text-white transition text-sm font-medium">Profile</button>
              <button onClick={() => scrollToSection(contactRef)} className="text-white/80 hover:text-white transition text-sm font-medium">Contact</button>
            </nav>

            {/* Hamburger */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative z-20 w-8 h-8 flex flex-col justify-center items-center gap-1.5">
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/20 py-6 px-4 flex flex-col gap-4 md:hidden z-10">
                <button onClick={() => scrollToSection(heroRef)} className="text-white text-lg py-2 hover:bg-white/10 rounded-lg">Home</button>
                <button onClick={openProjectsDrawer} className="text-white text-lg py-2 hover:bg-white/10 rounded-lg">Projects</button>
                <button onClick={() => scrollToSection(aboutRef)} className="text-white text-lg py-2 hover:bg-white/10 rounded-lg">About</button>
                <button onClick={openProfileDrawer} className="text-white text-lg py-2 hover:bg-white/10 rounded-lg">Profile</button>
                <button onClick={() => scrollToSection(contactRef)} className="text-white text-lg py-2 hover:bg-white/10 rounded-lg">Contact</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Projects Drawer (Half-side from left) */}
      <AnimatePresence>
        {isProjectsDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectsDrawerOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div
              ref={projectsDrawerRef}
              variants={leftDrawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-full sm:w-96 lg:w-[450px] bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl z-50 border-r border-white/20 overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                <button onClick={() => setIsProjectsDrawerOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl">✕</button>
                <h2 className="text-2xl font-bold text-white mb-6">📁 Your Projects & Meetings</h2>

                {/* Active Projects */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">📋 Active Projects</h3>
                  <div className="space-y-3">
                    {projects.filter(p => p.status !== 'Completed').map(project => (
                      <div key={project.id} className="bg-white/10 rounded-xl p-3 border border-white/20">
                        <div className="flex justify-between items-start">
                          <div><p className="text-white font-medium">{project.name}</p><p className="text-white/50 text-xs">Due {project.dueDate}</p></div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === 'In Development' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>{project.status}</span>
                        </div>
                        <div className="mt-2"><div className="w-full bg-white/20 rounded-full h-1.5"><div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div></div></div>
                        <button onClick={() => { setSelectedProject(project); setShowUploadModal(true); setIsProjectsDrawerOpen(false); }} className="mt-2 text-xs bg-sky-500/30 px-2 py-1 rounded text-white">Upload</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Meetings */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">📅 Upcoming Meetings</h3>
                  <div className="space-y-3">
                    {meetings.map(meet => (
                      <div key={meet.id} className="bg-white/10 rounded-xl p-3 border border-white/20">
                        <p className="text-white font-medium">{meet.title}</p>
                        <p className="text-white/60 text-xs">{meet.date} at {meet.time}</p>
                        <a href={meet.link} target="_blank" rel="noreferrer" className="text-sky-400 text-xs mt-1 inline-block">Join →</a>
                      </div>
                    ))}
                    <button onClick={handleRequestMeeting} className="w-full bg-white/10 py-2 rounded-lg text-white text-sm hover:bg-white/20 transition">
                      Request New Meeting
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Meeting Request Modal */}
      <AnimatePresence>
        {showMeetingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Schedule a Meeting</h3>
                <button onClick={() => setShowMeetingModal(false)} className="text-white/70 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleMeetingSubmit}>
                <div className="mb-4">
                  <label className="text-white/80 text-sm block mb-1">Meeting Title *</label>
                  <input type="text" value={newMeeting.title} onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white" required />
                </div>
                <div className="mb-4">
                  <label className="text-white/80 text-sm block mb-1">Date *</label>
                  <input type="date" value={newMeeting.date} onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white" required />
                </div>
                <div className="mb-4">
                  <label className="text-white/80 text-sm block mb-1">Time *</label>
                  <input type="time" value={newMeeting.time} onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white" required />
                </div>
                <div className="mb-6">
                  <label className="text-white/80 text-sm block mb-1">Meeting Link (optional)</label>
                  <input type="url" value={newMeeting.link} onChange={(e) => setNewMeeting({...newMeeting, link: e.target.value})} placeholder="https://meet.google.com/..." className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-sky-500 py-2 rounded-lg text-white font-medium">Submit Request</button>
                  <button type="button" onClick={() => setShowMeetingModal(false)} className="flex-1 bg-white/20 py-2 rounded-lg text-white">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Drawer (unchanged) */}
      <AnimatePresence>
        {isProfileDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileDrawerOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div ref={drawerRef} variants={drawerVariants} initial="hidden" animate="visible" exit="exit" className="fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[450px] bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl z-50 border-l border-white/20 overflow-y-auto">
              <div className="p-6 sm:p-8">
                <button onClick={() => { setIsProfileDrawerOpen(false); setIsEditingProfile(false); }} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl">✕</button>
                {/* Avatar & Edit */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg mb-4">
                    <span className="text-white text-3xl font-bold">{username.charAt(0).toUpperCase()}</span>
                  </div>
                  {!isEditingProfile ? (
                    <>
                      <h2 className="text-2xl font-bold text-white">{username}</h2>
                      <p className="text-white/60 text-sm">{userEmail}</p>
                      <p className="text-white/60 text-sm mt-1">{userPhone}</p>
                      <button onClick={handleEditProfile} className="mt-3 px-4 py-1.5 bg-white/20 rounded-lg text-white text-sm hover:bg-white/30">✏️ Edit Profile</button>
                    </>
                  ) : (
                    <div className="space-y-3 text-left mt-2">
                      <div><label className="text-white/70 text-xs">Full Name</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white" /></div>
                      <div><label className="text-white/70 text-xs">Email</label><input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white" /></div>
                      <div><label className="text-white/70 text-xs">Phone</label><input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white" /></div>
                      <div><label className="text-white/70 text-xs">New Password</label><input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Leave blank" className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white" /></div>
                      <div className="flex gap-3 mt-4"><button onClick={handleSaveProfile} className="flex-1 bg-green-600/80 py-2 rounded-lg text-white">Save</button><button onClick={handleCancelEdit} className="flex-1 bg-white/20 py-2 rounded-lg text-white">Cancel</button></div>
                    </div>
                  )}
                </div>
                {/* Last Login & Location */}
                <div className="bg-white/10 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm"><span>🕒</span> Last Login: <span className="text-sky-300">{lastLogin}</span></div>
                  <div className="flex items-center gap-2 text-white/80 text-sm"><span>🌍</span> Location: <span className="text-sky-300">{locationStr}</span></div>
                </div>
                {/* Security Section */}
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-semibold mb-2">🔐 Security Settings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-white/70 text-sm">Two‑Factor Authentication</span><button className="bg-white/10 px-3 py-1 rounded-lg text-xs text-white">Enable</button></div>
                    <div className="flex justify-between items-center"><span className="text-white/70 text-sm">Login Alerts (Email/SMS)</span><button className="bg-white/10 px-3 py-1 rounded-lg text-xs text-white">Configure</button></div>
                    <div className="flex justify-between items-center"><span className="text-white/70 text-sm">API Keys / Webhooks</span><button className="bg-white/10 px-3 py-1 rounded-lg text-xs text-white">Generate</button></div>
                  </div>
                </div>
                {/* Referral */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-semibold">🤝 Refer a Friend</h4>
                  <p className="text-white/70 text-xs mt-1">Earn $50 credit for each new client you bring</p>
                  <div className="flex mt-2 gap-2"><input type="text" readOnly value={referralLink} className="bg-white/10 text-white text-xs p-2 rounded flex-1" /><button onClick={() => navigator.clipboard.writeText(referralLink)} className="bg-white/20 px-3 py-1 rounded-lg text-white text-sm">Copy</button></div>
                </div>
                {/* Invoices */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><span>💳</span> Invoices & Payments</h3>
                  <div className="space-y-3">
                    {invoices.map(inv => (
                      <div key={inv.id} className="bg-white/10 rounded-xl p-3 border border-white/20">
                        <div className="flex justify-between"><span className="text-white font-mono text-sm">{inv.id}</span><span className={inv.status === 'Paid' ? 'text-green-300' : 'text-yellow-300'}>{inv.status}</span></div>
                        <p className="text-white/70 text-sm">{inv.project} - {inv.amount}</p>
                        <div className="flex justify-between mt-2"><span className="text-white/50 text-xs">Due {inv.dueDate}</span>{inv.status === 'Unpaid' && <button className="text-sky-400 text-xs">Pay Now →</button>}<button className="text-white/50 text-xs">PDF</button></div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full mt-4 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-semibold hover:bg-red-500/30 transition flex items-center justify-center gap-2"><span>🚪</span> Logout</button>
                <p className="text-white/30 text-xs text-center mt-6">Client ID: SB-{Math.floor(Math.random() * 10000)}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {/* Hero Section - Two Column, No Search Bar */}
        <section ref={heroRef} className="min-h-[90vh] flex items-center justify-center px-4 max-w-7xl mx-auto pt-16 pb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">Build with Confidence, {username}</h1>
              <p className="mt-4 text-xl sm:text-2xl font-semibold bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">Client Projects • Student Innovation</p>
              <p className="mt-4 text-white/70 max-w-lg mx-auto md:mx-0">From startup MVPs to academic capstones – we deliver secure, scalable, and impressive digital solutions. Trusted by 50+ clients and 200+ students.</p>
            <div className="mt-8">
  <Link
    to="/contact"
    className="inline-block px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition"
  >
    Explore Our Services
  </Link>
</div>
            </div>
            <div className="flex justify-center">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Team collaborating" className="rounded-2xl shadow-2xl border border-white/20 w-full max-w-md object-cover" />
            </div>
          </motion.div>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 -mt-8 mb-12">
          
        </div>

        {/* Services Cards */}
        <section ref={servicesRef} className="py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
            <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-bold text-white">What We Deliver</h2><p className="text-white/60 mt-3 max-w-xl mx-auto">Tailored for businesses and students alike</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeServices.map((service, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.15 }} whileHover={{ scale: 1.05 }} className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 text-center shadow-lg hover:shadow-sky-500/30 transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-2xl shadow-lg">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-white/60 text-sm">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* About Section – Trust & Process */}
        <section ref={aboutRef} className="py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8"><h2 className="text-3xl md:text-4xl font-bold text-white">Security & Trust at Every Step</h2><p className="text-white/70 mt-2 max-w-2xl mx-auto">Your data, your code, and your success are our top priorities.</p></div>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex gap-3 items-start"><span className="text-sky-400 text-2xl">🔒</span><div><h3 className="text-white text-xl font-semibold">Bank‑Grade Security</h3><p className="text-white/70">Encrypted communications, secure authentication, and regular vulnerability scans. We never store sensitive data without your consent.</p></div></div>
                <div className="flex gap-3 items-start"><span className="text-sky-400 text-2xl">🤝</span><div><h3 className="text-white text-xl font-semibold">Transparent Workflow</h3><p className="text-white/70">Weekly updates, shared Trello boards, and video walkthroughs. You’re always in the loop.</p></div></div>
                <div className="flex gap-3 items-start"><span className="text-sky-400 text-2xl">✅</span><div><h3 className="text-white text-xl font-semibold">Verified Track Record</h3><p className="text-white/70">50+ successful client projects, 200+ student projects delivered with 98% satisfaction.</p></div></div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start"><span className="text-sky-400 text-2xl">📋</span><div><h3 className="text-white text-xl font-semibold">Our 4‑Step Process</h3><p className="text-white/70">1. Discovery & Quote → 2. Agile Development → 3. Security Review & QA → 4. Launch & Maintenance</p></div></div>
                <div className="flex gap-3 items-start"><span className="text-sky-400 text-2xl">📄</span><div><h3 className="text-white text-xl font-semibold">NDA & IP Protection</h3><p className="text-white/70">All ideas and code remain yours. We sign non‑disclosure agreements before any conversation.</p></div></div>
                <div className="flex gap-3 items-start"><span className="text-sky-400 text-2xl">⭐</span><div><h3 className="text-white text-xl font-semibold">Client Testimonials</h3><p className="text-white/70">"They turned my college project into a market‑ready product!" – Rohan S. / "Secure, fast, and professional." – Neha M.</p></div></div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Detailed Services */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <div className="text-center mb-10"><h2 className="text-3xl font-bold text-white">Our Core Expertise</h2><p className="text-white/70 mt-2">For ambitious clients and students</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesList.map((service, idx) => (
                <motion.div key={idx} variants={fadeUp} whileHover={{ scale: 1.02 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5">
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-white/70 text-sm">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white">Meet the Experts</h2><p className="text-white/60">Your project’s success is in good hands</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/30"><img src={member.image} alt={member.name} className="w-full h-full object-cover" /></div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="text-sky-400 text-sm">{member.role}</p>
                <p className="text-white/60 text-sm mt-3">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section ref={contactRef} className="py-16 px-4 max-w-7xl mx-auto mb-12 scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid md:grid-cols-2 gap-8 items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <div><h2 className="text-3xl font-bold text-white">Ready to Build Your Project? 🚀</h2><p className="text-white/70 mt-3">Whether you're a client needing a product or a student aiming for an A+ project – we’ve got you covered.</p><div className="mt-5 space-y-2 text-white/80"><p>📧 no1serviceproviders@gmail.com</p><p>📞 +91 96296 96474</p><p>📍 Trichy</p></div></div>
            <div className="bg-white/5 rounded-2xl p-6 text-center"><div className="text-5xl mb-3">🔒</div><h3 className="text-xl font-semibold text-white">Free Confidential Consultation</h3><p className="text-white/70 text-sm mt-2">Discuss your idea under NDA. No obligation.</p>   <div className="mt-8">
  <Link
    to="/contact"
    className="inline-block px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition"
  >
   Book a call
  </Link>
</div></div>
          </motion.div>
        </section>
      </main>

      {/* File Upload Modal */}
      <AnimatePresence>
        {showUploadModal && selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 rounded-2xl p-6 w-96 border border-white/20">
              <h3 className="text-white text-xl mb-2">Upload for {selectedProject.name}</h3>
              <p className="text-white/60 text-sm mb-4">Submit deliverables, reports, or code files.</p>
              <input type="file" className="text-white/70 w-full mb-4" />
              <div className="flex gap-3"><button onClick={handleFileUpload} className="flex-1 bg-sky-500 px-4 py-2 rounded-lg text-white">Upload</button><button onClick={() => setShowUploadModal(false)} className="flex-1 bg-white/20 px-4 py-2 rounded-lg text-white">Cancel</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Chat Widget */}
      <button onClick={() => setShowChat(true)} className="fixed bottom-6 right-6 bg-sky-500 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-30 hover:bg-sky-600 transition">💬</button>
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 right-6 w-80 h-96 bg-gray-900 rounded-2xl border border-white/20 shadow-2xl z-30 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/20 flex justify-between items-center bg-gray-800/50">
              <span className="text-white font-semibold">💬 Support Chat</span>
              <button onClick={() => setShowChat(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg ${msg.from === 'user' ? 'bg-sky-500/30 text-white' : 'bg-white/10 text-white/90'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-[10px] text-white/40 block text-right mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <span className="text-sm text-white/70">Support is typing...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-white/20 flex gap-2 bg-gray-800/30">
              <input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="Type a message..." className="flex-1 bg-white/10 rounded-lg p-2 text-white text-sm outline-none focus:ring-1 focus:ring-sky-500" />
              <button onClick={sendChatMessage} className="bg-sky-500 px-3 rounded-lg text-white text-sm hover:bg-sky-600 transition">Send</button>
            </div>
          </motion.div>
          
        )}
      </AnimatePresence>

      {/* Footer - increased height */}
      <footer className="backdrop-blur-xl bg-black/20 border-t border-white/20 py-8">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm"><p>© {new Date().getFullYear()} SkyBridge Digital — Secure Project Delivery for Clients & Students</p></div>
      </footer>
    </div>
  );
};

export default Dashboard;
