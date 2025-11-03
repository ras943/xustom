
import React from 'react';
import type { CampaignSuggestion, KeywordSuggestion } from '../types';
import { SectionCard } from './SectionCard';

// Simple SVG Icons defined within the component for brevity
const SummaryIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const CreativeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
);
const KeywordIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
);
const AudienceIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const WandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H18a2 2 0 0 1 2 2v3.5L12 15l-4-4Z"/><path d="m5 12 4 4"/><path d="M12 3V.5"/><path d="M12 21v-2.5"/><path d="M21 12h-2.5"/><path d="M3 12H.5"/><path d="m18.36 5.64-.17-.17"/><path d="m5.81 18.19-.17-.17"/></svg>
);


interface ResultsDisplayProps {
  results: CampaignSuggestion;
  onGenerateVariations: (creativeIndex: number) => void;
  iteratingCreativeIndex: number | null;
}

const MatchTypeBadge: React.FC<{type: KeywordSuggestion['matchType']}> = ({ type }) => {
    const typeStyles = {
        Broad: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        Phrase: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        Exact: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles[type]}`}>{type}</span>
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onGenerateVariations, iteratingCreativeIndex }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-10 animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
      <div className="lg:col-span-2">
        <SectionCard title="Business Summary" icon={<SummaryIcon />}>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{results.businessSummary}</p>
        </SectionCard>
      </div>

      <SectionCard title="Ad Creatives" icon={<CreativeIcon />}>
        <div className="space-y-6">
          {results.adCreatives.map((creative, index) => {
            const isIterating = iteratingCreativeIndex === index;
            return (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100/70 dark:bg-gray-900/50">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <h4 className="font-semibold text-purple-600 dark:text-purple-300">{creative.headline}</h4>
                        <p className="text-sm mt-1">{creative.description}</p>
                    </div>
                    <button
                      onClick={() => onGenerateVariations(index)}
                      disabled={isIterating}
                      className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2.5 py-1.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/70 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-wait transition-all whitespace-nowrap"
                      aria-label={`Generate variations for ad creative ${index + 1}`}
                    >
                      {isIterating ? (
                         <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                           <span>Generating...</span>
                         </>
                      ) : (
                         <>
                          <WandIcon className="w-4 h-4" />
                          <span>Variations</span>
                         </>
                      )}
                    </button>
                </div>

                {creative.variations && creative.variations.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-purple-200 dark:border-purple-800 space-y-3">
                      <h5 className="text-sm font-bold text-gray-600 dark:text-gray-400">Variations:</h5>
                      {creative.variations.map((variation, vIndex) => (
                          <div key={vIndex} className="p-3 bg-white dark:bg-gray-800/60 rounded-md shadow-sm">
                              <h6 className="font-semibold text-purple-600 dark:text-purple-300 text-sm">{variation.headline}</h6>
                              <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">{variation.description}</p>
                          </div>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>


      <SectionCard title="Keyword Suggestions" icon={<KeywordIcon />}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th scope="col" className="px-4 py-3">Keyword</th>
                        <th scope="col" className="px-4 py-3">Match Type</th>
                        <th scope="col" className="px-4 py-3">Est. Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {results.keywords.map((kw, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-800/60 border-b dark:border-gray-700 last:border-b-0">
                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{kw.keyword}</th>
                            <td className="px-4 py-3"><MatchTypeBadge type={kw.matchType} /></td>
                            <td className="px-4 py-3">{kw.searchVolume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </SectionCard>

      <div className="lg:col-span-2">
         <SectionCard title="Audience Targeting Suggestions" icon={<AudienceIcon />}>
            <ul className="space-y-3 list-disc list-inside">
                {results.audienceSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </SectionCard>
      </div>
    </div>
  );
};