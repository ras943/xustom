
import { GoogleGenAI, Type } from "@google/genai";
import type { CampaignSuggestion, AdCreative } from '../types';

// Assume process.env.API_KEY is available
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully,
  // but for this context, throwing an error is fine.
  console.warn("API_KEY environment variable not set. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || " " }); // Use dummy key if not set to avoid crash

const campaignSchema = {
  type: Type.OBJECT,
  properties: {
    businessSummary: {
      type: Type.STRING,
      description: "A concise summary of the business, its products/services, and target audience based on the website URL.",
    },
    adCreatives: {
      type: Type.ARRAY,
      description: "A list of 3 compelling and unique ad creatives.",
      items: {
        type: Type.OBJECT,
        properties: {
          headline: {
            type: Type.STRING,
            description: "A short, engaging headline for the ad (max 30 characters).",
          },
          description: {
            type: Type.STRING,
            description: "A detailed description for the ad (max 90 characters).",
          },
        },
        required: ["headline", "description"],
      },
    },
    keywords: {
      type: Type.ARRAY,
      description: "A list of 10-15 relevant keywords.",
      items: {
        type: Type.OBJECT,
        properties: {
            keyword: { 
                type: Type.STRING, 
                description: "The suggested keyword." 
            },
            matchType: { 
                type: Type.STRING, 
                description: "The recommended match type: 'Broad', 'Phrase', or 'Exact'." 
            },
            searchVolume: { 
                type: Type.STRING, 
                description: "An estimated monthly search volume category (e.g., 'High', 'Medium', 'Low')." 
            },
        },
        required: ["keyword", "matchType", "searchVolume"],
      },
    },
    audienceSuggestions: {
      type: Type.ARRAY,
      description: "A list of 3-5 target audience segments with descriptions.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["businessSummary", "adCreatives", "keywords", "audienceSuggestions"],
};


export const generateCampaignSuggestions = async (url: string): Promise<CampaignSuggestion> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const prompt = `
      You are an expert AI Google Ads campaign strategist. Your task is to analyze a given website URL and generate a complete starter pack for a Google Ads campaign.

      Based on the website URL provided: ${url}

      Please perform the following actions and provide the output in a structured JSON format:

      1.  **Website Analysis & Business Summary**: Briefly analyze the likely business, its products/services, and target audience based on the URL. Write a concise summary.
      2.  **Ad Creative Generation**: Generate 3 unique and compelling ad creatives. Each creative should have a headline (max 30 characters) and a description (max 90 characters). The copy should be engaging and tailored to the business.
      3.  **Keyword Suggestions**: Provide a list of 10-15 relevant keywords. For each keyword, you must:
          a. Provide the keyword itself.
          b. Categorize it into a match type: 'Broad', 'Phrase', or 'Exact'.
          c. Provide an estimated search volume classification (e.g., 'High', 'Medium', 'Low').
      4.  **Audience Targeting Suggestions**: Suggest 3-5 target audience segments. Describe them based on demographics, interests, or in-market segments relevant to the business.

      Your response MUST conform to the provided JSON schema. Do not include any explanatory text outside of the JSON object itself.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: campaignSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    return parsedData as CampaignSuggestion;

  } catch (error) {
    console.error("Error generating campaign suggestions:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate suggestions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating suggestions.");
  }
};

const creativeVariationsSchema = {
    type: Type.ARRAY,
    description: "A list of 2 new, distinct ad creative variations.",
    items: {
        type: Type.OBJECT,
        properties: {
            headline: {
                type: Type.STRING,
                description: "A short, engaging headline for the ad (max 30 characters).",
            },
            description: {
                type: Type.STRING,
                description: "A detailed description for the ad (max 90 characters).",
            },
        },
        required: ["headline", "description"],
    },
};

export const generateCreativeVariations = async (businessSummary: string, originalCreative: AdCreative): Promise<AdCreative[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    try {
        const prompt = `
            You are an expert AI Google Ads copywriter. Your task is to generate creative variations for an existing ad creative, based on a business summary.

            Business Summary:
            "${businessSummary}"

            Original Ad Creative:
            - Headline: "${originalCreative.headline}"
            - Description: "${originalCreative.description}"

            Please generate 2 new, distinct variations of this ad creative. The variations should maintain a similar tone but explore different angles, benefits, or calls-to-action. Adhere strictly to character limits: headlines must be 30 characters or less, and descriptions must be 90 characters or less.

            Your response MUST be a JSON array of ad creative objects, conforming to the provided schema. Do not include any explanatory text outside of the JSON array.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: creativeVariationsSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        return parsedData as AdCreative[];

    } catch (error) {
        console.error("Error generating creative variations:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate variations: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating variations.");
    }
};