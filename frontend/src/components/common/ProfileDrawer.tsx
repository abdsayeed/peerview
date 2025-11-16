import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Mock stats - these should come from API
  const stats = {
    questions: 12,
    answers: 3,
  };

  const modules = ['COM101', 'COM205', 'COM682'];

  if (!user) return null;

  return (
    <>
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer - slides in from right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#212121] border-l border-[#e7e7e7] dark:border-[#2f2f2f] z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#e7e7e7] dark:border-[#2f2f2f] flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-black dark:text-white">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-[#707579] dark:text-[#aaaaaa] hover:text-black dark:hover:text-white hover:bg-[#e7e7e7] dark:hover:bg-[#2f2f2f] rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Large Avatar */}
          <div className="flex flex-col items-center">
            <Avatar name={user.name} size="xl" className="mb-3" />
            <h3 className="text-[17px] font-semibold text-black dark:text-white">
              {user.name}
            </h3>
            <p className="text-[14px] text-[#707579] dark:text-[#aaaaaa] mt-0.5">
              {user.email}
            </p>
            <div className="mt-2">
              <Badge variant={user.role as 'student' | 'teacher' | 'admin'} className="px-3 py-1">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Modules - only for students */}
          {user.role === 'student' && (
            <div>
              <h4 className="text-[13px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wide mb-2">
                Modules
              </h4>
              <div className="flex flex-wrap gap-2">
                {modules.map((module) => (
                  <span
                    key={module}
                    className="px-3 py-1 bg-[#e4e9ec] dark:bg-[#2f2f2f] text-[#2AABEE] dark:text-[#8BCFFF] text-[13px] font-medium rounded-full"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div>
            <h4 className="text-[13px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wide mb-3">
              Activity
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e4e9ec] dark:bg-[#2f2f2f] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#2AABEE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-black dark:text-white">Questions</span>
                </div>
                <span className="text-[16px] font-semibold text-black dark:text-white">
                  {stats.questions}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e4e9ec] dark:bg-[#2f2f2f] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#2AABEE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-black dark:text-white">Answers</span>
                </div>
                <span className="text-[16px] font-semibold text-black dark:text-white">
                  {stats.answers}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            className="w-full px-4 py-2.5 bg-[#2AABEE] hover:bg-[#2A9FDB] text-white text-[14px] font-medium rounded-lg transition-colors"
            onClick={() => {
              // TODO: Navigate to edit profile page
              console.log('Edit profile');
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};
