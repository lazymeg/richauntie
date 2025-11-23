import { GoogleGenAI } from "@google/genai";
import { getSystemInstruction, FEW_SHOT_EXAMPLES } from '../constants';

// --- API Key Initialization Logic ---
// 這裡保留最廣泛的檢查方式，以確保 Netlify 可以讀取到金鑰
const netlifyInjectedKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;

// 初始化 AI client 一次
// 如果 netlifyInjectedKey 為空，程式碼會繼續運行，並使用後面的錯誤處理 (fallback)
const ai = new GoogleGenAI({ apiKey: netlifyInjectedKey });

const RANDOM_MOODS = [
  "Be concise and sassy.",
  "Be motherly and warm.",
  "Focus on financial independence.",
  "Focus on self-love and confidence.",
  "Use a metaphor about luxury or food.",
  "Be realistically cynical but funny.",
  "Focus on the joy of lying flat.",
  "Make a sharp observation about society."
];

// Fallback logic now considers history to avoid repetition even when API fails
const getFallbackAdvice = (topicLabel: string, history: string[] = []): string => {
  const relevantQuotes = FEW_SHOT_EXAMPLES.filter(ex => 
    topicLabel.includes(ex.topic) || ex.topic.includes(topicLabel)
  );

  // Filter out quotes that are already in history
  const availableQuotes = relevantQuotes.filter(quote => !history.includes(quote.response));

  // If we've shown all quotes, reset pool to all relevant quotes
  const pool = availableQuotes.length > 0 ? availableQuotes : (relevantQuotes.length > 0 ? relevantQuotes : FEW_SHOT_EXAMPLES);
  
  const randomPick = pool[Math.floor(Math.random() * pool.length)];
  return randomPick.response;
};

// Function to shuffle and pick N items from an array
function getRandomSubarray<T>(arr: T[], size: number): T[] {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp: T;
    let index: number;
    while (i--) {
        index = Math.floor(Math.random() * (i + 1));
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

export const getRichLadyAdvice = async (
  topicLabel: string, 
  userName: string, 
  isContinuation: boolean = false, 
  history: string[] = []
): Promise<string> => {
  try {
    const randomMood = RANDOM_MOODS[Math.floor(Math.random() * RANDOM_MOODS.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    // Get strictly relevant examples for this topic
    const relevantExamples = FEW_SHOT_EXAMPLES.filter(ex => ex.topic === topicLabel);
    const selectedExamples = getRandomSubarray(relevantExamples, 3);
    
    // Construct a dynamic context string
    const exampleContext = selectedExamples.map(ex => `- Example Style: "${ex.response}"`).join('\n');
    
    // Add history constraints
    const historyContext = history.length > 0 
      ? `\n[Constraints] DO NOT repeat any of the following previous advice:\n${history.map(h => `- "${h}"`).join('\n')}`
      : "";

    let prompt = "";
    
    if (!isContinuation) {
      prompt = `
      [Context] Request ID: ${randomSeed}. Topic: "${topicLabel}". User Name: "${userName}".
      [Persona Reference] You are "阿姨" (Auntie). User is "${userName}".
      [Style Inspiration] Use these examples as a tone guide, but DO NOT copy them word-for-word. Create something new in this style:
      ${exampleContext}
      ${historyContext}
      
      [Directive] Mood: ${randomMood}.
      [Task] Write a single, punchy piece of advice for "${userName}".
      - Address the user as "${userName}" naturally.
      - Refer to yourself as "阿姨".
      - Be witty, slightly cynical but ultimately supportive.
      - Length: < 60 words.
      `;
    } else {
      prompt = `
      [Context] Request ID: ${randomSeed}. User "${userName}" wants MORE on: "${topicLabel}".
      ${historyContext}
      [Directive] Deepen the conversation.
      [Task] The user is listening. Share a deeper philosophy or a relatable struggle "阿姨" had in the past related to ${topicLabel}.
      - Don't just repeat the previous sentiment.
      - Address "${userName}" if fitting.
      - Be a bit more storytelling-oriented.
      - Length: < 100 words.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(userName),
        temperature: 0.9,
        maxOutputTokens: 300,
      },
    });

    if (response.text && response.text.trim().length > 0) {
      return response.text;
    }
    return getFallbackAdvice(topicLabel, history);

  } catch (error) {
    console.error("Gemini API Error (using fallback):", error);
    // Silent fallback on error (including 429)
    return getFallbackAdvice(topicLabel, history);
  }
};

export const analyzeImageAndGetAdvice = async (base64Image: string, mimeType: string, userName: string): Promise<string> => {
  try {
     const prompt = `
      [Task] Analyze this image and react as the "Rich Auntie" (富婆阿姨).
      - If it's text, read it and comment in your sassy style.
      - If it's a photo, judge it (nicely) or praise it.
      - Call the user "${userName}".
      - Refer to yourself as "阿姨".
      - Be witty.
     `;

     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: getSystemInstruction(userName),
        temperature: 0.8,
      }
     });

     return response.text || "哎呀，阿姨的老花眼鏡好像度數不夠，看不太清。不過這圖感覺挺有意思的。";

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "阿姨的網路助手去喝下午茶了，暫時看不清這張圖。你直接跟我說比較快。";
  }
}
