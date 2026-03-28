import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Background from '../components/Background';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, getAllUsers, approveUser, rejectUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadUsers();
    }
  }, [user]);

  const loadUsers = () => {
    const all = getAllUsers();
    setUsers(all);
    setLoading(false);
  };

  const handleApprove = (id) => {
    approveUser(id);
    loadUsers();
  };

  const handleReject = (id) => {
    rejectUser(id);
    loadUsers();
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-white text-center mt-20">Access Denied. Admin only.</div>;
  }

  const pending = users.filter(u => !u.approved && u.role === 'user');
  const approved = users.filter(u => u.approved || u.role === 'admin');

 return (
    <div className="relative min-h-screen flex flex-col">
      <Background variant="professional" />  
      
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-white/80 hover:text-white transition text-sm md:text-base">
              ← Back to Dashboard
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{user?.username?.[0]?.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl text-white font-bold mb-2">Payment Approvals</h2>
          <p className="text-white/70">Manage user registrations and approve payments</p>
        </div>

        {/* Pending Requests */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
            <h3 className="text-xl text-white font-semibold">Pending Approvals ({pending.length})</h3>
          </div>
          
          {pending.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl p-8 text-center">
              <p className="text-white/70">No pending requests. All users have been processed.</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {pending.map(u => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-white font-bold text-lg">{u.companyName}</h4>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                          Pending
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <p><span className="text-white/60">Username:</span> <span className="text-white/90">{u.username}</span></p>
                        <p><span className="text-white/60">Email:</span> <span className="text-white/90">{u.email}</span></p>
                        <p><span className="text-white/60">Phone:</span> <span className="text-white/90">{u.phone}</span></p>
                        <p><span className="text-white/60">Location:</span> <span className="text-white/90">{u.district}, {u.pincode}</span></p>
                        <p><span className="text-white/60">Service:</span> 
                          <span className={`ml-1 ${u.service === 'web' ? 'text-purple-300' : 'text-blue-300'}`}>
                            {u.service === 'web' ? 'Web Development' : 'Marketing'}
                          </span>
                        </p>
                        <p><span className="text-white/60">Payment Method:</span> 
                          <span className="ml-1 text-green-300">
                            {u.paymentMethod === 'upi' ? `UPI: ${u.upiId}` : 'QR Scanner'}
                          </span>
                        </p>
                      </div>
                      <p className="text-white/60 text-sm mt-2">
                        <span className="font-medium">Address:</span> {u.address}
                      </p>
                    </div>
                    <div className="flex gap-3 self-start lg:self-center">
                      <button
                        onClick={() => handleApprove(u.id)}
                        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-md hover:scale-105"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(u.id)}
                        className="px-5 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all shadow-md hover:scale-105"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Users */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-green-500 rounded-full"></div>
            <h3 className="text-xl text-white font-semibold">Approved Users ({approved.length})</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {approved.map(u => (
              <div
                key={u.id}
                className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">{u.companyName}</h4>
                  {u.role === 'admin' && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Admin</span>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-white/60">User:</span> {u.username}</p>
                  <p><span className="text-white/60">Email:</span> {u.email}</p>
                  <p><span className="text-white/60">Service:</span> {u.service === 'web' ? 'Web Dev' : 'Marketing'}</p>
                  <p><span className="text-white/60">Payment:</span> {u.paymentMethod === 'upi' ? 'UPI' : 'QR'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto backdrop-blur-xl bg-black/20 border-t border-white/20 py-6">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} GlassFlow Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;