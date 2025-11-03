
import React from 'react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70">
        <div className="flex items-center gap-3">
          <span className="text-purple-500 dark:text-purple-400">{icon}</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      </div>
      <div className="p-5 text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
};
