
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CampaignActions } from './components/CampaignActions';
import { ThemeToggle } from './components/ThemeToggle';
import { generateCampaignSuggestions, generateCreativeVariations } from './services/geminiService';
import type { CampaignSuggestion, ApiState } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  
  const [apiState, setApiState] = useState<ApiState>('idle');
  const [results, setResults] = useState<CampaignSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing your website...');
  const [iteratingCreativeIndex, setIteratingCreativeIndex] = useState<number | null>(null);


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    let intervalId: number | undefined;

    if (apiState === 'loading') {
      const messages = [
        "Analyzing website content...",
        "Identifying target audience...",
        "Crafting compelling ad copy...",
        "Brainstorming keywords...",
        "Assembling your campaign..."
      ];
      let messageIndex = 0;
      
      setLoadingMessage(messages[messageIndex]); // Set initial message

      intervalId = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setLoadingMessage(messages[messageIndex]);
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [apiState]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleUrlSubmit = async (url: string) => {
    setApiState('loading');
    setError(null);
    setResults(null);

    try {
      // Basic URL validation
      new URL(url);
    } catch (_) {
      setError("Invalid URL: Please enter a full, valid URL including http:// or https://.");
      setApiState('error');
      return;
    }

    try {
      const suggestions = await generateCampaignSuggestions(url);
      setResults(suggestions);
      setApiState('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('configured')) {
        setError("API Key Issue: Please make sure your Google Gemini API key is correctly set up as an environment variable. The application cannot connect to the AI service without it.");
      } else {
        setError(`Generation Failed: ${errorMessage}`);
      }
      setApiState('error');
    }
  };
  
  const handleGenerateVariations = async (creativeIndex: number) => {
    if (!results) return;

    setIteratingCreativeIndex(creativeIndex);
    try {
        const originalCreative = results.adCreatives[creativeIndex];
        const variations = await generateCreativeVariations(results.businessSummary, originalCreative);

        setResults(prevResults => {
            if (!prevResults) return null;
            const newCreatives = [...prevResults.adCreatives];
            // Replace existing variations with new ones, or add them if they don't exist
            newCreatives[creativeIndex] = {
                ...newCreatives[creativeIndex],
                variations: variations,
            };
            return {
                ...prevResults,
                adCreatives: newCreatives,
            };
        });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
        // Simple alert for user feedback on this specific action
        alert(`Could not generate variations: ${errorMessage}`);
    } finally {
        setIteratingCreativeIndex(null);
    }
  };

  const renderErrorContent = () => {
    if (!error) return null;

    let title = "Oops! Something Went Wrong";
    let details = error;
    let actionContent: React.ReactNode = null;
    let icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );

    if (error.startsWith("API Key Issue:")) {
      title = "API Key Issue";
      details = error.replace("API Key Issue: ", "");
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      );
      actionContent = (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-gray-900/70 border border-yellow-200 dark:border-gray-700 rounded-lg text-left max-w-md w-full">
            <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">How to Fix</h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-3 mt-2">
                <li>
                    First, get your API key. If you don't have one, you can create one for free.
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="block mt-1 text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 hover:underline transition-colors">
                        Get an API Key from Google AI Studio &rarr;
                    </a>
                </li>
                <li>
                    Next, set the key as an environment variable named <code className="bg-yellow-100 dark:bg-gray-700 text-yellow-800 dark:text-yellow-200 px-1 py-0.5 rounded text-xs">API_KEY</code>. This keeps your key secure and out of the source code. The method for setting it varies by your operating system and development setup.
                     <a href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment#environment_variables" target="_blank" rel="noopener noreferrer" className="block mt-1 text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 hover:underline transition-colors">
                       Learn how to set environment variables &rarr;
                    </a>
                </li>
            </ol>
          </div>
      );
    } else if (error.startsWith("Invalid URL:")) {
      title = "Invalid URL";
      details = error.replace("Invalid URL: ", "");
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    } else if (error.startsWith("Generation Failed:")) {
        title = "Generation Failed";
        details = error.replace("Generation Failed: ", "");
    }

    return (
      <div className="text-center my-10 p-6 bg-red-50 dark:bg-gray-800/50 backdrop-blur-sm border border-red-200 dark:border-gray-700 rounded-xl animate-fade-in">
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
        <div className="flex flex-col items-center justify-center gap-4">
          {icon}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">{details}</p>
          {actionContent}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (apiState) {
      case 'loading':
        return <LoadingSpinner message={loadingMessage} />;
      case 'success':
        return results && (
          <>
            <ResultsDisplay 
              results={results}
              onGenerateVariations={handleGenerateVariations}
              iteratingCreativeIndex={iteratingCreativeIndex} 
            />
            <CampaignActions results={results} />
          </>
        );
      case 'error':
        return renderErrorContent();
      case 'idle':
      default:
        return (
          <div className="text-center my-16 text-gray-500">
            <p>Enter a URL above to generate your Google Ads campaign assets.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Header />
        <UrlInputForm onSubmit={handleUrlSubmit} isLoading={apiState === 'loading'} />
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800 text-sm">
        <p>Powered by Google Gemini. For demonstration purposes only.</p>
      </footer>
    </div>
  );
};

export default App;