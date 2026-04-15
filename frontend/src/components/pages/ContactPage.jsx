// src/pages/ContactPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Background from '../components/Background';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  // Load saved form data from localStorage on mount
  const loadSavedData = () => {
    const saved = localStorage.getItem('contactFormData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const [formData, setFormData] = useState(() => {
    const saved = loadSavedData();
    if (saved) return saved;
    return {
      name: '',
      email: '',
      serviceType: 'web',
      webPages: '',
      webFeatures: [],
      appPlatforms: [],
      appType: '',
      marketingServices: [],
      targetAudience: '',
      budgetRange: '',
      additionalInfo: ''
    };
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [bookingMethod, setBookingMethod] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const formRef = useRef(null);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('contactFormData', JSON.stringify(formData));
  }, [formData]);

  // Scroll to top after submission
  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitted]);

  // Calculate estimated timeline based on selections
  const getEstimatedTimeline = () => {
    const { serviceType, webPages, webFeatures, appPlatforms, appType, marketingServices } = formData;
    
    if (serviceType === 'web') {
      const pages = parseInt(webPages) || 5;
      const featureCount = webFeatures.length;
      let weeks = 2;
      if (pages > 10) weeks += 2;
      else if (pages > 5) weeks += 1;
      if (featureCount > 5) weeks += 2;
      else if (featureCount > 2) weeks += 1;
      if (webFeatures.includes('E‑commerce') || webFeatures.includes('Payment gateway')) weeks += 1;
      return `${weeks} - ${weeks + 2} weeks`;
    }
    if (serviceType === 'app') {
      const platforms = appPlatforms.length;
      let weeks = 4; // base for single platform
      if (platforms > 1) weeks += 2;
      if (appType === 'native') weeks += 1;
      if (appType === 'cross') weeks -= 1;
      return `${weeks} - ${weeks + 3} weeks`;
    }
    if (serviceType === 'marketing') {
      const servicesCount = marketingServices.length;
      let weeks = 1; // strategy
      if (servicesCount > 2) weeks += 1;
      return `${weeks} - ${weeks + 2} weeks (initial campaign)`;
    }
    return '2 - 4 weeks';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (formData.serviceType === 'web' && !formData.webPages) {
      newErrors.webPages = 'Please estimate number of pages';
    }
    if (formData.serviceType === 'app' && formData.appPlatforms.length === 0) {
      newErrors.appPlatforms = 'Select at least one platform';
    }
    if (formData.serviceType === 'marketing' && formData.marketingServices.length === 0) {
      newErrors.marketingServices = 'Select at least one marketing service';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear field-specific error when user starts typing
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceTypeChange = (type) => {
    setFormData(prev => ({ ...prev, serviceType: type }));
    // Clear errors related to old service type
    setErrors({});
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmittingForm(true);
    try {
      // Simulate API call or just capture lead
      console.log('Lead captured via form:', formData);
      // In real app, send to backend
      setBookingMethod('form');
      setSubmitted(true);
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleWhatsAppClick = () => {
    const timeline = getEstimatedTimeline();
    const message = encodeURIComponent(
`Hi SkyBridge Digital! 👋

I'm interested in a ${formData.serviceType} project.

Name: ${formData.name}
Email: ${formData.email}

Project Details:
- Estimated timeline: ${timeline}
- Pages: ${formData.webPages || '-'}
- Features: ${formData.webFeatures?.join(', ') || '-'}
- Platforms: ${formData.appPlatforms?.join(', ') || '-'}
- App type: ${formData.appType || '-'}
- Marketing services: ${formData.marketingServices?.join(', ') || '-'}
- Target audience: ${formData.targetAudience || '-'}
- Budget: ${formData.budgetRange || '-'}

Additional Info: ${formData.additionalInfo || '-'}

Looking forward to your response!`
    );
    window.open(`https://wa.me/919677674551?text=${message}`, '_blank');
    setBookingMethod('whatsapp');
    setSubmitted(true);
  };

  const handleBookCall = () => {
    const calendlyUrl = "https://calendly.com/skybridge-digital/30min";
    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    setBookingMethod("call");
    setSubmitted(true);
  };

  const handleAddToProject = async () => {
    const leadData = {
      ...formData,
      method: bookingMethod,
      estimatedTimeline: getEstimatedTimeline(),
      timestamp: new Date().toISOString()
    };
    setIsAdding(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (response.ok) {
        alert('✅ Lead added to your project board!');
        // Optionally clear localStorage after successful save
        // localStorage.removeItem('contactFormData');
      } else {
        const errorData = await response.json();
        alert(`❌ Failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setIsAdding(false);
    }
  };

  // Dynamic placeholder for additional info
  const getAdditionalInfoPlaceholder = () => {
    switch (formData.serviceType) {
      case 'web': return 'e.g., Do you have existing branding? Any specific deadline?';
      case 'app': return 'e.g., Do you have wireframes? Any third‑party integrations needed?';
      case 'marketing': return 'e.g., Current website URL, existing social media handles, main competitors.';
      default: return 'Any other requirements or questions?';
    }
  };

  // Render dynamic fields based on serviceType
  const renderDynamicFields = () => {
    switch (formData.serviceType) {
      case 'web':
        return (
          <>
            <div>
              <label className="block text-white/80 text-sm mb-1">Number of pages (approx) *</label>
              <input
                type="text"
                name="webPages"
                value={formData.webPages}
                onChange={handleInputChange}
                placeholder="e.g., 5-10 pages"
                className={`w-full px-3 py-2 bg-white/10 border ${errors.webPages ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-white/50 text-sm`}
              />
              {errors.webPages && <p className="text-red-400 text-xs mt-1">{errors.webPages}</p>}
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Features needed (select all that apply)</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {['E‑commerce', 'Blog', 'CMS', 'User login', 'Payment gateway', 'Booking system', 'API integration'].map(feature => (
                  <label key={feature} className="flex items-center gap-2 text-white/70 text-sm">
                    <input type="checkbox" name="webFeatures" value={feature} onChange={handleInputChange} className="rounded" />
                    {feature}
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      case 'app':
        return (
          <>
            <div>
              <label className="block text-white/80 text-sm mb-1">Platform(s) *</label>
              <div className="space-y-2">
                {['iOS', 'Android', 'Both'].map(platform => (
                  <label key={platform} className="flex items-center gap-2 text-white/70 text-sm">
                    <input type="checkbox" name="appPlatforms" value={platform} onChange={handleInputChange} className="rounded" />
                    {platform}
                  </label>
                ))}
              </div>
              {errors.appPlatforms && <p className="text-red-400 text-xs mt-1">{errors.appPlatforms}</p>}
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">App type</label>
              <select
                name="appType"
                value={formData.appType}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10 transition"
              >
                <option value="" className="bg-gray-900 text-gray-400">Select app type</option>
                <option value="native" className="bg-gray-900">Native (iOS / Android specific)</option>
                <option value="cross" className="bg-gray-900">Cross-platform (React Native / Flutter)</option>
                <option value="pwa" className="bg-gray-900">Progressive Web App (PWA)</option>
              </select>
            </div>
          </>
        );
      case 'marketing':
        return (
          <>
            <div>
              <label className="block text-white/80 text-sm mb-1">Marketing services needed *</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {['SEO', 'Social Media Management', 'Google Ads (PPC)', 'Content Marketing', 'Email Marketing', 'Analytics Setup'].map(service => (
                  <label key={service} className="flex items-center gap-2 text-white/70 text-sm">
                    <input type="checkbox" name="marketingServices" value={service} onChange={handleInputChange} className="rounded" />
                    {service}
                  </label>
                ))}
              </div>
              {errors.marketingServices && <p className="text-red-400 text-xs mt-1">{errors.marketingServices}</p>}
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Target audience / industry</label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="e.g., B2B SaaS, local retail, e‑commerce"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Monthly budget range</label>
              <select
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10 transition"
              >
                <option value="" className="bg-gray-900 text-gray-300">Select</option>
                <option value="< $1k" className="bg-gray-900">Less than $1,000</option>
                <option value="$1k-$5k" className="bg-gray-900">$1,000 – $5,000</option>
                <option value="$5k-$10k" className="bg-gray-900">$5,000 – $10,000</option>
                <option value="> $10k" className="bg-gray-900">Over $10,000</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Background variant="professional" />

      {/* Header - increased height (matches Dashboard) */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20 py-4 sm:py-5">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
              SkyBridge Digital
            </span>
          </Link>
          <Link to="/dashboard" className="text-white/70 hover:text-white text-sm sm:text-base transition">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full"
        >
          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-5xl font-bold text-white">🚀 Start Your Project</h1>
                <p className="text-white/70 mt-3 text-sm sm:text-base">
                  Tell us about your requirements – we’ll respond within 24 hours.
                </p>
                {/* Estimated timeline banner */}
                <div className="mt-4 inline-block px-4 py-1.5 bg-sky-500/20 border border-sky-500/30 rounded-full text-sky-300 text-sm">
                  ⏱️ Estimated timeline: {getEstimatedTimeline()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Card */}
                <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-xl font-semibold text-white">Project Requirements</h3>
                  <p className="text-white/60 text-sm mt-1">Fill in the details below</p>
                  <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name *"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-white/10 border ${errors.name ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-white/50 text-sm`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address *"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-white/50 text-sm`}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Service Type Selection */}
                    <div>
                      <label className="block text-white/80 text-sm mb-2">What service do you need? *</label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: 'web', label: '🌐 Web Development' },
                          { value: 'app', label: '📱 App Development' },
                          { value: 'marketing', label: '📈 Digital Marketing' }
                        ].map(service => (
                          <button
                            key={service.value}
                            type="button"
                            onClick={() => handleServiceTypeChange(service.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                              formData.serviceType === service.value
                                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {service.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Fields */}
                    {renderDynamicFields()}

                    <textarea
                      name="additionalInfo"
                      placeholder={getAdditionalInfoPlaceholder()}
                      rows="3"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
                    />

                    <button
                      type="submit"
                      disabled={isSubmittingForm}
                      className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg text-white font-medium hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmittingForm ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : 'Send Requirements'}
                    </button>
                  </form>
                </motion.div>

                {/* WhatsApp & Call Cards */}
                <div className="space-y-6">
                  <motion.div whileHover={{ scale: 1.02 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
                    <div className="text-4xl mb-3">💬</div>
                    <h3 className="text-xl font-semibold text-white">Chat on WhatsApp</h3>
                    <p className="text-white/60 text-sm mt-1">Instant reply via WhatsApp</p>
                    <button onClick={handleWhatsAppClick} className="mt-4 px-4 py-2 bg-green-500/80 hover:bg-green-500 rounded-lg text-white font-medium transition w-full">
                      Start WhatsApp Chat
                    </button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
                    <div className="text-4xl mb-3">📞</div>
                    <h3 className="text-xl font-semibold text-white">Book a Call</h3>
                    <p className="text-white/60 text-sm mt-1">30‑min free consultation</p>
                    <button onClick={handleBookCall} className="mt-4 px-4 py-2 bg-purple-500/80 hover:bg-purple-500 rounded-lg text-white font-medium transition w-full">
                      Schedule Call
                    </button>
                  </motion.div>
                </div>
              </div>
              <div className="mt-10 text-center text-white/50 text-xs">
                Or email us directly: <span className="text-white/80">no1serviceproviders@gmail.com</span>
              </div>
            </>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-2xl max-w-md mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white">Thank you!</h2>
              <p className="text-white/70 mt-2">
                {bookingMethod === 'form' && "We've received your project requirements. Our team will get back to you shortly."}
                {bookingMethod === 'whatsapp' && "Great! Continue the conversation on WhatsApp – we're ready to help."}
                {bookingMethod === 'call' && "You'll be redirected to our calendar. Pick a time that suits you."}
              </p>
              <button onClick={handleAddToProject} disabled={isAdding} className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50 flex items-center justify-center gap-2 w-full">
                {isAdding ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : '➕ Add to Project'}
              </button>
              <p className="text-white/40 text-xs mt-4">Click “Add to Project” to save this lead to your dashboard.</p>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer - increased height */}
      <footer className="mt-auto backdrop-blur-xl bg-black/20 border-t border-white/20 py-8 text-center text-white/40 text-sm">
        <p>© {new Date().getFullYear()} SkyBridge Digital – Let’s build something great.</p>
      </footer>
    </div>
  );
};

export default ContactPage;
