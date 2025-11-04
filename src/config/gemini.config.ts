/**
 * Gemini AI Configuration
 * Manages API connections for all 5 AI features
 */

export const GEMINI_CONFIG = {
  // Core Gemini API
  apiKey: process.env.REACT_APP_GEMINI_API_KEY || '',

  // Model configurations
  models: {
    intelligence: 'gemini-pro', // Core game logic
    chat: 'gemini-pro', // Dialogues and conversations
    vision: 'gemini-pro-vision', // Image analysis (if needed)
  },

  // Feature flags for Gemini Apps Builder
  features: {
    nanoBanana: true, // Visual content generation
    geminiIntelligence: true, // Core game logic
    aiChatbot: true, // Conversations
    generateSpeech: true, // Commentary voices
    fastAiResponses: true, // Real-time updates
  },

  // AI Parameters
  parameters: {
    temperature: 0.8, // Creativity level (0-1)
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },

  // Commentary settings
  speech: {
    languages: {
      en: {
        voice: 'en-US-Neural2-J', // Male professional commentator
        rate: 1.0,
        pitch: 0,
      },
      tr: {
        voice: 'tr-TR-Wavenet-B', // Turkish male commentator
        rate: 1.0,
        pitch: 0,
      },
    },
  },

  // Image generation settings (Nano Banana)
  imageGeneration: {
    quality: 'high',
    style: 'professional',
    formats: ['twitter_post', 'player_card', 'match_result', 'transfer_announcement'],
  },

  // Rate limiting and performance
  rateLimits: {
    requestsPerMinute: 60,
    tokensPerMinute: 100000,
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    backoffMs: 1000,
    exponential: true,
  },
};

// Prompt templates for different AI tasks
export const AI_PROMPTS = {
  matchCommentary: {
    system: `You are a professional football commentator providing live match commentary in {language}.
You have deep knowledge of both teams, their recent form, key players, and tactical setups.
Generate realistic, exciting commentary that reacts naturally to match events.

RULES:
- Never repeat exact phrases from previous commentary
- Use actual player names from the squad
- Match tone to the event importance (derby = more excited)
- Keep sentences concise and dynamic
- Reference team tactics if relevant`,

    contextTemplate: `Match: {homeTeam} vs {awayTeam}
League: {league}
Minute: {minute}
Score: {score}
Last Event: {event}
Team Form: {form}
Recent Commentary: {recentCommentary}`,
  },

  tweetGeneration: {
    system: `You are simulating realistic Twitter/X reactions to football matches.
Generate tweets that sound like REAL fans, journalists, or players would write.
Include appropriate emojis, hashtags, and internet language.

RULES:
- Sound like a real person, not corporate
- Include 1-2 relevant emojis
- Use appropriate hashtags (1-2 max)
- Vary language (not every tweet needs perfect grammar)
- NO generic templates
- Max 280 characters`,

    personas: {
      Fan: 'Show genuine emotion (joy/frustration based on result)',
      Hater: 'Be critical but not offensive',
      Journalist: 'Professional analysis with statistics',
      Rival: 'Banter and teasing',
      Player: 'Personal perspective, emotional or professional based on personality',
    },
  },

  transferNegotiation: {
    system: `You are the sporting director of {club}. A rival manager wants to buy one of your players.
You must negotiate realistically based on:
- Player importance to your team
- Player contract situation
- Club financial needs
- Player's personal wishes
- Rival relationship

RULES:
- Stay in character as sporting director
- Reference previous conversation points naturally
- Give clear yes/no/counter-offer responses
- Explain your reasoning briefly
- No generic rejection templates`,
  },

  pressConference: {
    system: `You are a football journalist conducting a press conference.
Ask tough but fair questions based on recent events, team performance, and controversies.

RULES:
- Reference actual match results and events
- Ask follow-up questions based on manager's responses
- Vary question difficulty (easy to controversial)
- Professional tone but can be probing
- Build narrative throughout the conference`,
  },

  playerConversation: {
    system: `You are {playerName}, a {age}-year-old {position} playing for {team}.
Your personality type is: {personality}
Current morale: {morale}
Recent form: {form}

RULES:
- Stay in character based on personality type
- Reference actual playing time and performance
- Show appropriate emotion for morale level
- Be realistic about career aspirations
- React to manager's tone`,
  },
};

// Context builders for AI requests
export const buildMatchCommentaryContext = (
  match: any,
  event: any,
  recentCommentary: string[]
) => {
  return {
    homeTeam: match.homeTeam.name,
    awayTeam: match.awayTeam.name,
    league: match.homeTeam.league,
    minute: event.minute,
    score: `${match.homeScore}-${match.awayScore}`,
    event: event.description,
    form: `${match.homeTeam.name} recent form vs ${match.awayTeam.name} recent form`,
    recentCommentary: recentCommentary.slice(-3).join('\n'),
  };
};

export const buildTweetContext = (
  event: any,
  gameState: any,
  persona: string
) => {
  return {
    persona,
    event: event.description,
    team: event.team,
    player: event.player,
    score: event.score,
    importance: event.impact,
    userTeam: gameState.currentTeam.name,
  };
};

// API endpoint configurations
export const API_ENDPOINTS = {
  geminiIntelligence: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  generateSpeech: 'https://texttospeech.googleapis.com/v1/text:synthesize',
  nanoBanana: 'https://imagen.googleapis.com/v1/images:generate', // Placeholder for image generation API
};

// Error messages
export const AI_ERROR_MESSAGES = {
  API_KEY_MISSING: 'Gemini API key is not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file.',
  RATE_LIMIT_EXCEEDED: 'Too many AI requests. Please wait a moment and try again.',
  NETWORK_ERROR: 'Unable to connect to Gemini AI. Please check your internet connection.',
  INVALID_RESPONSE: 'Received invalid response from AI. Retrying...',
  GENERATION_FAILED: 'Failed to generate content. Using fallback response.',
};

export default GEMINI_CONFIG;
