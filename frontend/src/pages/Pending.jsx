import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../components/Background';

const Pending = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Background />
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl text-white">Account Pending Approval</h2>
        <p className="text-white/80 mt-2">Your registration is awaiting admin approval. You'll be notified once approved.</p>
        <Link to="/login" className="mt-4 inline-block bg-purple-500 text-white px-6 py-2 rounded-xl">Back to Login</Link>
      </div>
    </div>
  );
};

export default Pending;