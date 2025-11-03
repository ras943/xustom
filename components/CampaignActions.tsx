
import React, { useState } from 'react';
import type { CampaignSuggestion } from '../types';
import { SectionCard } from './SectionCard';

const ApplyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


interface CampaignActionsProps {
  results: CampaignSuggestion;
}

const ActionButton: React.FC<{ onClick: () => void; copied: boolean; text: string; icon: React.ReactNode; }> = ({ onClick, copied, text, icon }) => (
  <button
    onClick={onClick}
    className={`w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 border rounded-lg transition-all duration-200 ${
      copied
        ? 'bg-green-100 dark:bg-green-600/20 border-green-500 text-green-700 dark:text-green-300'
        : 'bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-purple-500 dark:hover:border-purple-400'
    }`}
  >
    {copied ? <CheckIcon className="w-4 h-4" /> : icon}
    <span>{copied ? 'Copied!' : text}</span>
  </button>
);


export const CampaignActions: React.FC<CampaignActionsProps> = ({ results }) => {
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const handleCopy = (key: string, textGenerator: () => string) => {
    navigator.clipboard.writeText(textGenerator());
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
  };

  const formatCreativesForCopy = () => {
    return results.adCreatives
      .map((ad, index) => {
        let creativeText = `Ad Creative ${index + 1}\nHeadline: ${ad.headline}\nDescription: ${ad.description}`;
        if (ad.variations && ad.variations.length > 0) {
          const variationsText = ad.variations.map((v, vIndex) => 
            `  Variation ${vIndex + 1}\n  - Headline: ${v.headline}\n  - Description: ${v.description}`
          ).join('\n');
          creativeText += `\n\nVariations:\n${variationsText}`;
        }
        return creativeText;
      })
      .join('\n\n---\n\n');
  };

  const formatKeywordsForCopy = () => {
    return results.keywords
        .map(kw => `${kw.keyword} (${kw.matchType}, Volume: ${kw.searchVolume})`)
        .join('\n');
  };
  
  const handleDownload = () => {
    const jsonString = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'google-ads-campaign-plan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-10 animate-fade-in">
        <SectionCard title="Apply Your Campaign" icon={<ApplyIcon />}>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
                Your campaign starter pack is ready. Use the tools below to copy your assets or download the full plan to use in Google Ads Editor or share with your team.
            </p>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Copy Assets</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <ActionButton 
                            onClick={() => handleCopy('creatives', formatCreativesForCopy)}
                            copied={!!copied.creatives}
                            text="Copy Ad Creatives"
                            icon={<CopyIcon className="w-4 h-4" />}
                        />
                        <ActionButton 
                            onClick={() => handleCopy('keywords', formatKeywordsForCopy)}
                            copied={!!copied.keywords}
                            text="Copy Keywords"
                            icon={<CopyIcon className="w-4 h-4" />}
                        />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Export Plan</h4>
                     <button
                        onClick={handleDownload}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 border rounded-lg transition-all duration-200 bg-purple-600/80 border-purple-500 text-white hover:bg-purple-600"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        <span>Download as JSON</span>
                    </button>
                </div>
            </div>
        </SectionCard>
    </div>
  );
};