// src/pages/Register.jsx
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // ✅ Correct import
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Background from '../components/Background';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    username: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    pincode: '',
    service: 'web',          // 'web' or 'marketing'
    paymentMethod: 'qr',     // 'qr' or 'upi'
    upiId: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Compute price based on service
  const price = formData.service === 'web' ? 2 : 1;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.companyName) tempErrors.companyName = 'Required';
    if (!formData.username) tempErrors.username = 'Required';
    if (!formData.phone) tempErrors.phone = 'Required';
    if (!formData.email) tempErrors.email = 'Required';
    if (!formData.address) tempErrors.address = 'Required';
    if (!formData.district) tempErrors.district = 'Required';
    if (!formData.pincode) tempErrors.pincode = 'Required';
    if (!formData.service) tempErrors.service = 'Required';
    if (!formData.paymentMethod) tempErrors.paymentMethod = 'Required';
    if (formData.paymentMethod === 'upi' && !formData.upiId) tempErrors.upiId = 'UPI ID is required';
    if (!formData.password) tempErrors.password = 'Required';
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const newUser = {
        ...formData,
        price,
      };
      register(newUser);
      setRegisterSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  if (registerSuccess) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <Background />
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl text-white">Registration Successful!</h2>
          <p className="text-white/80 mt-2">Your account is pending admin approval. You'll be notified once approved.</p>
          <button onClick={() => navigate('/login')} className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-xl">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-y-auto py-8 md:py-12">
      <Background />
      <div className="container mx-auto px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 my-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.companyName && <p className="text-red-300 text-xs mt-1">{errors.companyName}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.username && <p className="text-red-300 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.address && <p className="text-red-300 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* District */}
            <div>
              <label className="block text-white/80 text-sm mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.district && <p className="text-red-300 text-xs mt-1">{errors.district}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.pincode && <p className="text-red-300 text-xs mt-1">{errors.pincode}</p>}
            </div>

            {/* Service Selection (Dropdown) */}
          <div>
  <label className="block text-white/80 text-sm mb-1">Select Service</label>
  <select
    name="service"
    value={formData.service}
    onChange={handleChange}
    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
  >
    <option value="web" className="bg-gray-800 text-white">Web Development (₹2)</option>
    <option value="marketing" className="bg-gray-800 text-white">Marketing (₹1)</option>
  </select>
  {errors.service && <p className="text-red-300 text-xs mt-1">{errors.service}</p>}
</div>

            {/* Price Display */}
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <span className="text-white/80">Registration Fee: </span>
              <span className="text-white font-bold text-xl">₹{price}</span>
            </div>

            {/* Payment Method Selection (Dropdown) */}
           <div>
  <label className="block text-white/80 text-sm mb-1">Payment Method</label>
  <select
    name="paymentMethod"
    value={formData.paymentMethod}
    onChange={handleChange}
    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
  >
    <option value="qr" className="bg-gray-800 text-white">QR Scanner</option>
    <option value="upi" className="bg-gray-800 text-white">UPI ID</option>
  </select>
  {errors.paymentMethod && <p className="text-red-300 text-xs mt-1">{errors.paymentMethod}</p>}
</div>

            {/* Conditional Payment Details */}
            {formData.paymentMethod === 'qr' && (
              <div className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                <div className="w-32 h-32 flex items-center justify-center mb-2">
                 <QRCodeSVG
  value={`upi://pay?pa=vklloganathan2002-1@okaxis&pn=YourName&am=${price}&cu=INR`}
  size={120}
  bgColor="transparent"
fgColor="#ffffff"
/>
                </div>
                <p className="text-white/80 text-sm text-center">
                  Scan QR code to pay ₹{price}
                </p>
              </div>
            )}

            {formData.paymentMethod === 'upi' && (
              <div>
                <label className="block text-white/80 text-sm mb-1">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g., name@okhdfcbank"
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
                />
                {errors.upiId && <p className="text-red-300 text-xs mt-1">{errors.upiId}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-base"
              />
              {errors.confirmPassword && <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Register & Pay ₹{price}
            </button>
          </form>
          <p className="text-center text-white/70 mt-5 text-sm sm:text-base">
            Already have an account?{' '}
            <a href="/login" className="text-purple-200 hover:text-white transition">
              Login
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;