import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code2, 
  Trophy, 
  BarChart3, 
  Flame, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Cpu, 
  Menu,
  X,
  UserPlus,
  LogIn,
  Atom,
  Search,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { StreakWidget } from '../streak/StreakWidget';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register' | 'admin'>('login');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStreakPopoverOpen, setIsStreakPopoverOpen] = useState(false);

  const isAdminPage = location.pathname.startsWith('/admin');

  const navLinks = [
    { path: '/problems', label: 'Problems', icon: Code2 },
    { path: '/contests', label: 'Contests', icon: Trophy },
    { path: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { path: '/architecture', label: 'Architecture Guide', icon: Cpu },
  ];

  const isActive = (path: string) => {
    if (path === '/problems' && location.pathname.startsWith('/problems')) return true;
    if (path === '/contests' && location.pathname.startsWith('/contests')) return true;
    return location.pathname === path;
  };

  const getInitials = (name: string) => {
    if (!name) return 'Q';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const openAuth = (tab: 'login' | 'register' | 'admin') => {
    setAuthDefaultTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <>
      {/* Header Bar */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs font-sans transition-colors ${
        isAdminPage ? 'bg-purple-950/95 text-white border-purple-900' : 'bg-[#fffdf0]/95 border-amber-200/90 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md border group-hover:scale-105 transition-transform duration-200 ${
                  isAdminPage
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-gradient-to-tr from-sky-500 to-sky-400 border-sky-300/50 text-white'
                }`}>
                  {isAdminPage ? <Shield className="w-5 h-5" /> : <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />}
                </div>
                
                <div className="flex flex-col">
                  <span className={`font-bold text-xl tracking-tight leading-none font-serif ${isAdminPage ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                    Quantum<span className={isAdminPage ? 'text-purple-300' : 'text-sky-600'}>Arena</span>
                  </span>
                  <span className={`text-[9px] tracking-widest font-mono font-bold uppercase mt-0.5 ${isAdminPage ? 'text-purple-300' : 'text-slate-500'}`}>
                    {isAdminPage ? 'ADMIN CONSOLE PORTAL' : 'Coding Platform'}
                  </span>
                </div>
              </Link>

              {/* Desktop Links */}
              {isAdminPage ? (
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-800 text-purple-100 border border-purple-700 shadow-xs font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                    🛡️ Administrator Control Center
                  </span>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          active
                            ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-amber-100/60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-sky-500' : 'text-slate-400'}`} />
                        <span className="font-serif text-sm font-semibold" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Action Bar */}
            <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
              
              {isAdminPage ? (
                <>
                  <Link
                    to="/"
                    className="h-9 px-4 rounded-xl bg-purple-900 hover:bg-purple-800 text-purple-200 hover:text-white text-xs font-bold border border-purple-700 transition-colors flex items-center space-x-2 font-serif"
                    style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Exit Admin Portal</span>
                  </Link>

                  <span className="h-9 flex items-center space-x-1.5 px-3 rounded-xl text-xs font-bold bg-purple-800 text-purple-100 border border-purple-600 transition-all whitespace-nowrap font-mono">
                    <Shield className="w-3.5 h-3.5 text-purple-300" />
                    <span>ADMIN: {user?.username || 'SYSTEM'}</span>
                  </span>

                  <button
                    onClick={logout}
                    className="h-9 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-800 transition-colors flex items-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Quick Search Button */}
                  <Link
                    to="/problems"
                    className="h-9 px-3 rounded-xl bg-white border border-amber-200 text-slate-500 hover:text-slate-900 text-xs font-medium hover:border-sky-300 transition-colors shadow-xs flex items-center space-x-2 whitespace-nowrap"
                    title="Search problems"
                  >
                    <Search className="w-3.5 h-3.5 text-sky-500" />
                    <span>Search...</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-mono border border-amber-200 text-slate-400">Ctrl K</kbd>
                  </Link>

                  {isAuthenticated && user ? (
                    <>
                      {/* Daily Streak Pill with Popover */}
                      <div className="relative">
                        <button
                          onClick={() => setIsStreakPopoverOpen(!isStreakPopoverOpen)}
                          className="focus:outline-none"
                        >
                          <StreakWidget compact={true} />
                        </button>

                        {isStreakPopoverOpen && (
                          <div className="absolute right-0 mt-2 w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <StreakWidget compact={false} />
                          </div>
                        )}
                      </div>

                      {/* ADMIN PORTAL BADGE: ONLY SHOWN IF ROLE IS ADMIN */}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="h-9 flex items-center space-x-1.5 px-3 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all whitespace-nowrap font-serif"
                          style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                        >
                          <Shield className="w-3.5 h-3.5 text-purple-600" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      {/* User Avatar Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                          className="h-9 flex items-center space-x-2.5 px-3 rounded-xl bg-white border border-amber-200 hover:border-sky-400 transition-colors focus:outline-none shadow-xs whitespace-nowrap"
                        >
                          <div className="w-6 h-6 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                            {getInitials(user.name || user.username)}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{user.name || user.username}</span>
                        </button>

                        {isProfileMenuOpen && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-amber-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
                            <div className="px-4 py-2 border-b border-amber-100">
                              <p className="text-sm font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-sky-600 font-mono">@{user.username}</p>
                              <p className="text-[11px] text-slate-500">{user.email}</p>
                            </div>

                            <Link
                              to="/profile"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 transition-colors"
                            >
                              <UserIcon className="w-4 h-4 text-slate-400" />
                              <span>My Profile & Streak Stats</span>
                            </Link>

                            {user.role === 'admin' && (
                              <Link
                                to="/admin"
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="flex items-center space-x-2 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                              >
                                <Shield className="w-4 h-4 text-purple-600" />
                                <span>Admin Portal</span>
                              </Link>
                            )}

                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                logout();
                              }}
                              className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-amber-100"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openAuth('login')}
                        className="h-9 flex items-center space-x-1.5 px-3.5 rounded-xl bg-white hover:bg-amber-50 text-slate-800 font-semibold text-xs border border-amber-200 transition-all whitespace-nowrap shadow-xs font-serif"
                        style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                      >
                        <LogIn className="w-4 h-4 text-sky-500" />
                        <span>Sign In</span>
                      </button>

                      <button
                        onClick={() => openAuth('register')}
                        className="h-9 flex items-center space-x-1.5 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20 whitespace-nowrap font-serif"
                        style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Register</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authDefaultTab}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};
