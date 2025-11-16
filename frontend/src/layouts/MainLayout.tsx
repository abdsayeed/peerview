import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { ProfileDrawer } from '../components/common/ProfileDrawer';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Feed',
      path: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      roles: ['student', 'teacher', 'admin'],
    },
    {
      name: 'My Questions',
      path: '/my-questions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      roles: ['student'],
    },
    {
      name: 'Teacher Dashboard',
      path: '/teacher',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      roles: ['teacher'],
    },
    {
      name: 'Admin Panel',
      path: '/admin',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      roles: ['admin'],
    },
  ];

  const visibleNavigation = navigation.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4e9ec] dark:bg-[#0e0e0e]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Telegram-style Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-80 h-full transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-white dark:bg-[#212121] border-r border-[#e7e7e7] dark:border-[#2f2f2f] flex flex-col`}
      >
        {/* Header with hamburger menu */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7e7e7] dark:border-[#2f2f2f]">
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-[#707579] dark:text-[#aaaaaa] hover:bg-[#f4f4f5] dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-[17px] font-medium text-black dark:text-white">PeerView</h1>
          <div className="w-10 lg:w-0" />
        </div>

        {/* Search bar */}
        <div className="px-3 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-[#f4f4f5] dark:bg-[#2f2f2f] border-0 rounded-lg text-[14px] text-black dark:text-white placeholder-[#707579] dark:placeholder-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#2AABEE]"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707579] dark:text-[#aaaaaa]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-3 py-2">
          <button
            onClick={() => setProfileDrawerOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <Avatar name={user?.name || ''} size="md" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {user?.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant={user?.role as 'student' | 'teacher' | 'admin'} className="text-xs px-2 py-0">
                  {user?.role}
                </Badge>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto tg-scrollbar px-2 py-2">
          {visibleNavigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`tg-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-6 h-6">{item.icon}</div>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Settings and Logout */}
        <div className="px-2 py-3 border-t border-[#e7e7e7] dark:border-[#2f2f2f]">
          <button
            className="tg-nav-item w-full"
            onClick={() => {}}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Settings</span>
          </button>
          <button
            className="tg-nav-item w-full text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20"
            onClick={handleLogout}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-80 h-full">
        {/* Top header - mobile only */}
        <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-[#212121] border-b border-[#e7e7e7] dark:border-[#2f2f2f]">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#707579] dark:text-[#aaaaaa] hover:bg-[#f4f4f5] dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-[17px] font-medium text-black dark:text-white">PeerView</h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto tg-scrollbar bg-[#e4e9ec] dark:bg-[#0e0e0e] pb-16 lg:pb-0">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* Mobile bottom navigation */}
        <MobileBottomNav />
      </div>

      {/* Profile Drawer */}
      <ProfileDrawer 
        isOpen={profileDrawerOpen} 
        onClose={() => setProfileDrawerOpen(false)} 
      />
    </div>
  );
};
