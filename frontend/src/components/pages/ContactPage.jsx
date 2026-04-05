// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../config/config';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    serviceType: 'web', // 'web', 'app' 'marketing'
    // Web fields
    webPages: '',
    webFeatures: [],
    // App fields
    appPlatforms: [],
    appType: '',
    // Marketing fields
    marketingServices: [],
    targetAudience: '',
    budgetRange: '',
    // Common
    additionalInfo: ''
  });

  const handlePayment = async()=>
  {
    try
    {
      const {data:order} = await axios.post(`${base_url}/api/payment/create-order`,{amount:10})
      const options = {
        key:"rzp_test_SWjsMZ52d9oTcb",
        amount:order.amount,
        currency:"INR",
        name:"serviceproviders",
        order_id:order.id,
        method: {
          upi: true,    
          card: true,
          netbanking: true,
          wallet: true
        },
        handler: async function(response){
          const verifyRes = await axios.post(`${base_url}/api/payment/verify`,
            {
              ...response,amount:10,
            }
          )
          if(verifyRes.data.success)
          {
            alert("payment success")
          }
          else{
            alert("payment failed")
          }
        }
      }
      const rzp = new window.Razorpay(options);
      rzp.open()
    }
    catch(err){
      console.log(err,"in open payment")
    }
  }
  const [submitted, setSubmitted] = useState(false);
  const [bookingMethod, setBookingMethod] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({ ...prev, [name]: [...prev[name], value] }));
      } else {
        setFormData(prev => ({ ...prev, [name]: prev[name].filter(item => item !== value) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceTypeChange = (type) => {
    setFormData(prev => ({ ...prev, serviceType: type }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Lead captured via form:', formData);
    setBookingMethod('form');
    setSubmitted(true);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hi SkyBridge Digital! I'm interested in a ${formData.serviceType} project.\nDetails: ${JSON.stringify(formData)}`
    );
    window.open(`https://wa.me/919629696474?text=${message}`, '_blank');
    setBookingMethod('whatsapp');
    setSubmitted(true);
  };

  const handleBookCall = () => {
    window.open('https://calendly.com/skybridge-digital/30min', '_blank');
    setBookingMethod('call');
    setSubmitted(true);
  };

  const handleAddToProject = async () => {
    const leadData = {
      ...formData,
      method: bookingMethod,
      timestamp: new Date().toISOString()
    };
    setIsAdding(true);
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (response.ok) {
        alert('✅ Lead added to your project board!');
      } else {
        alert('❌ Failed to add lead. Please try again.');
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setIsAdding(false);
    }
  };

  // Render dynamic fields based on serviceType
  const renderDynamicFields = () => {
    switch (formData.serviceType) {
      case 'web':
        return (
          <>
            <div>
              <label className="block text-white/80 text-sm mb-1">Number of pages (approx)</label>
              <input type="text" name="webPages" value={formData.webPages} onChange={handleInputChange} placeholder="e.g., 5-10 pages" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Features needed (select all that apply)</label>
              <div className="space-y-2">
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
              <label className="block text-white/80 text-sm mb-1">Platform(s)</label>
              <div className="space-y-2">
                {['iOS', 'Android', 'Both'].map(platform => (
                  <label key={platform} className="flex items-center gap-2 text-white/70 text-sm">
                    <input type="checkbox" name="appPlatforms" value={platform} onChange={handleInputChange} className="rounded" />
                    {platform}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">App type</label>
              <select name="appType" value={formData.appType} onChange={handleInputChange} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
                <option value="">Select</option>
                <option value="native">Native (iOS/Android specific)</option>
                <option value="cross">Cross‑platform (React Native/Flutter)</option>
                <option value="pwa">Progressive Web App (PWA)</option>
              </select>
            </div>
          </>
        );
      case 'marketing':
        return (
          <>
            <div>
              <label className="block text-white/80 text-sm mb-1">Marketing services needed</label>
              <div className="space-y-2">
                {['SEO', 'Social Media Management', 'Google Ads (PPC)', 'Content Marketing', 'Email Marketing', 'Analytics Setup'].map(service => (
                  <label key={service} className="flex items-center gap-2 text-white/70 text-sm">
                    <input type="checkbox" name="marketingServices" value={service} onChange={handleInputChange} className="rounded" />
                    {service}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Target audience / industry</label>
              <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="e.g., B2B SaaS, local retail, e‑commerce" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Monthly budget range</label>
              <select name="budgetRange" value={formData.budgetRange} onChange={handleInputChange} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
                <option value="">Select</option>
                <option value="< $1k">Less than $1,000</option>
                <option value="$1k-$5k">$1,000 – $5,000</option>
                <option value="$5k-$10k">$5,000 – $10,000</option>
                <option value="> $10k">Over $10,000</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      {/* <Background variant="professional" /> */}

      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20 py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
              SkyBridge Digital
            </span>
          </Link>
          <Link to="/" className="text-white/70 hover:text-white text-sm sm:text-base transition">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Card (now includes scope fields) */}
                <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-xl font-semibold text-white">Project Requirements</h3>
                  <p className="text-white/60 text-sm mt-1">Fill in the details below</p>
                  <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">

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

                    <textarea name="additionalInfo" placeholder="Any other requirements or questions?" rows="3" value={formData.additionalInfo} onChange={handleInputChange} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm" />

                    <button type="button" onClick={handlePayment} className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg text-white font-medium hover:shadow-lg transition">make an payment</button>
                  </form>
                </motion.div>

                {/* WhatsApp & Call Cards (unchanged) */}
                <div className="space-y-6">
                  <motion.div whileHover={{ scale: 1.02 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
                    <div className="text-4xl mb-3">💬</div>
                    <h3 className="text-xl font-semibold text-white">Chat on WhatsApp</h3>
                    <p className="text-white/60 text-sm mt-1">Instant reply via WhatsApp</p>
                    <button onClick={handleWhatsAppClick} className="mt-4 px-4 py-2 bg-green-500/80 hover:bg-green-500 rounded-lg text-white font-medium transition w-full">Start WhatsApp Chat</button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
                    <div className="text-4xl mb-3">📞</div>
                    <h3 className="text-xl font-semibold text-white">Book a Call</h3>
                    <p className="text-white/60 text-sm mt-1">30‑min free consultation</p>
                    <button onClick={handleBookCall} className="mt-4 px-4 py-2 bg-purple-500/80 hover:bg-purple-500 rounded-lg text-white font-medium transition w-full">Schedule Call</button>
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
              <button onClick={handleAddToProject} disabled={isAdding} className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50">
                {isAdding ? 'Adding...' : '➕ Add to Project'}
              </button>
              <p className="text-white/40 text-xs mt-4">Click “Add to Project” to save this lead to your dashboard.</p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <footer className="mt-auto backdrop-blur-xl bg-black/20 border-t border-white/20 py-4 text-center text-white/40 text-xs">
        <p>© {new Date().getFullYear()} SkyBridge Digital – Let’s build something great.</p>
      </footer>
    </div>
  );
};

export default ContactPage;
