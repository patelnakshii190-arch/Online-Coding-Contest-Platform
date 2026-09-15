import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, User as UserIcon, Code2, ArrowRight, UserCheck, Shield, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register' | 'admin';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
}) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<'login' | 'register' | 'admin'>(initialTab);
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCurrentTab(initialTab);
    setError('');
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (currentTab === 'login') {
        if (!email || !password) {
          setError('Please enter your email address and password.');
          return;
        }
        await login(email, password);
        onClose();
        navigate('/profile');
      } else if (currentTab === 'admin') {
        if (!email || !password) {
          setError('Please enter your administrator email and password.');
          return;
        }
        await login(email.includes('admin') ? email : 'admin@quantumarena.com', password);
        onClose();
        navigate('/admin');
      } else {
        if (!name || !username || !email || !password) {
          setError('Please enter your Full Name, Coder Handle, Email, and Password.');
          return;
        }
        await register(name, username, email, password);
        onClose();
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl overflow-hidden font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-amber-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center border-b border-amber-100 bg-amber-50/40">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border ${
            currentTab === 'admin' ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-sky-50 border-sky-200 text-sky-500'
          }`}>
            {currentTab === 'admin' ? <Shield className="w-6 h-6" /> : <Code2 className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            {currentTab === 'login' ? 'Sign In to QuantumArena' : currentTab === 'admin' ? 'Admin Department Access' : 'Create Coder Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentTab === 'login'
              ? 'Enter your account details to access your coding dashboard & contests.'
              : currentTab === 'admin'
              ? 'Sign in with Administrator credentials from the Admin Department.'
              : 'Register your account to open your personal coding dashboard.'}
          </p>

          {/* Navigation Tabs */}
          <div className="flex border-b border-amber-200 mt-4">
            <button
              onClick={() => { setCurrentTab('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 ${
                currentTab === 'login' ? 'border-sky-500 text-sky-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setCurrentTab('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 ${
                currentTab === 'register' ? 'border-sky-500 text-sky-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => { setCurrentTab('admin'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1 ${
                currentTab === 'admin' ? 'border-purple-600 text-purple-700 font-bold' : 'border-transparent text-slate-500 hover:text-purple-600'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {currentTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Coder Handle / Username</label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. rahul_coder"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {currentTab === 'admin' ? 'Administrator Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentTab === 'admin' ? 'admin@quantumarena.com' : 'user@example.com'}
                className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {currentTab === 'admin' && (
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-800 font-mono">
              💡 <strong>Quick Demo Admin Access:</strong> Email: <code>admin@quantumarena.com</code>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2.5 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 font-serif ${
              currentTab === 'admin' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20'
            }`}
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <span>
              {currentTab === 'login'
                ? 'Sign In to Dashboard'
                : currentTab === 'admin'
                ? 'Access Admin Dashboard'
                : 'Create My Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
