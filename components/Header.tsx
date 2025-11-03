
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73L12 3z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center gap-4 mb-2">
        <SparklesIcon className="w-10 h-10 text-purple-500 dark:text-purple-400" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          AI Google Ads Campaign Generator
        </h1>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Enter a website URL to instantly generate ad creatives, keywords, and audience suggestions.
      </p>
    </header>
  );
};
