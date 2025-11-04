/**
 * Gemini AI Service
 * Manages all interactions with Google Gemini APIs
 */

import { GEMINI_CONFIG, AI_PROMPTS, API_ENDPOINTS, AI_ERROR_MESSAGES } from '../config/gemini.config';
import type {
  CommentaryRequest,
  TweetGenerationRequest,
  DialogueRequest,
  CommentaryLine,
  Tweet
} from '../types';

class GeminiService {
  private apiKey: string;
  private requestCount: number = 0;
  private lastRequestTime: number = Date.now();

  constructor() {
    this.apiKey = GEMINI_CONFIG.apiKey;
    if (!this.apiKey) {
      console.error(AI_ERROR_MESSAGES.API_KEY_MISSING);
    }
  }

  /**
   * Rate limiting check
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeElapsed = now - this.lastRequestTime;

    if (timeElapsed < 60000) {
      // Within 1 minute
      if (this.requestCount >= GEMINI_CONFIG.rateLimits.requestsPerMinute) {
        const waitTime = 60000 - timeElapsed;
        console.warn(`Rate limit reached. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
      }
    } else {
      // Reset counter after 1 minute
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    this.requestCount++;
  }

  /**
   * Core Gemini API request with retry logic
   */
  private async makeGeminiRequest(
    prompt: string,
    systemInstruction: string,
    temperature: number = GEMINI_CONFIG.parameters.temperature
  ): Promise<string> {
    await this.checkRateLimit();

    const { maxAttempts, backoffMs, exponential } = GEMINI_CONFIG.retry;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.geminiIntelligence}?key=${this.apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: systemInstruction },
                    { text: prompt }
                  ]
                }
              ],
              generationConfig: {
                temperature,
                topP: GEMINI_CONFIG.parameters.topP,
                topK: GEMINI_CONFIG.parameters.topK,
                maxOutputTokens: GEMINI_CONFIG.parameters.maxOutputTokens,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
          throw new Error(AI_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data.candidates[0].content.parts[0].text;

      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);

        if (attempt < maxAttempts) {
          const waitTime = exponential ? backoffMs * Math.pow(2, attempt - 1) : backoffMs;
          console.log(`Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          throw new Error(`${AI_ERROR_MESSAGES.GENERATION_FAILED}: ${error}`);
        }
      }
    }

    throw new Error(AI_ERROR_MESSAGES.GENERATION_FAILED);
  }

  /**
   * Generate match commentary with voice synthesis
   */
  async generateMatchCommentary(request: CommentaryRequest): Promise<CommentaryLine> {
    const { language, event, context, previousCommentary } = request;

    // Build the prompt
    const systemPrompt = AI_PROMPTS.matchCommentary.system.replace('{language}', language === 'tr' ? 'Turkish' : 'English');

    const contextPrompt = `
Match Context:
- Teams: ${context.gameState.currentTeam.name} vs Opponent
- Minute: ${event.minute}
- Event: ${event.description}
- Previous Commentary: ${previousCommentary.slice(-2).map(c => c.text).join('\n')}

Generate 2-3 sentences of exciting live commentary for this event. Make it unique and contextual.
`;

    try {
      const commentaryText = await this.makeGeminiRequest(contextPrompt, systemPrompt, 0.9);

      // Generate speech audio (placeholder - actual implementation would call Text-to-Speech API)
      const audioUrl = await this.generateSpeechAudio(commentaryText, language);

      return {
        minute: event.minute,
        text: commentaryText.trim(),
        audioUrl,
        language,
        excitement: this.calculateExcitementLevel(event.type),
      };
    } catch (error) {
      console.error('Commentary generation failed:', error);

      // Fallback commentary
      return {
        minute: event.minute,
        text: this.getFallbackCommentary(event, language),
        language,
        excitement: 5,
      };
    }
  }

  /**
   * Generate speech audio from text
   */
  private async generateSpeechAudio(text: string, language: 'en' | 'tr'): Promise<string> {
    // TODO: Implement actual Text-to-Speech API call
    // For now, return a placeholder

    try {
      const voiceConfig = GEMINI_CONFIG.speech.languages[language];

      const response = await fetch(
        `${API_ENDPOINTS.generateSpeech}?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: language === 'tr' ? 'tr-TR' : 'en-US',
              name: voiceConfig.voice,
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: voiceConfig.rate,
              pitch: voiceConfig.pitch,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Speech generation failed');
      }

      const data = await response.json();
      return `data:audio/mp3;base64,${data.audioContent}`;
    } catch (error) {
      console.error('Speech generation failed:', error);
      return ''; // Return empty string if speech generation fails
    }
  }

  /**
   * Generate Twitter/X tweets
   */
  async generateTweet(request: TweetGenerationRequest): Promise<Tweet> {
    const { persona, context, gameContext } = request;

    const systemPrompt = AI_PROMPTS.tweetGeneration.system;
    const personaGuideline = AI_PROMPTS.tweetGeneration.personas[persona] || AI_PROMPTS.tweetGeneration.personas.Fan;

    const contextPrompt = `
Persona: ${persona}
Guideline: ${personaGuideline}

Context:
- Event: ${context.eventType}
- Team: ${context.relatedPlayer ? `Player ${context.relatedPlayer}` : 'Team event'}
- User's Team: ${gameContext.gameState.currentTeam.name}

Generate a single realistic tweet (max 280 characters) reacting to this event. Include emojis and hashtags naturally.
`;

    try {
      const tweetContent = await this.makeGeminiRequest(contextPrompt, systemPrompt, 0.95);

      // Generate accompanying image if appropriate
      const imageUrl = await this.shouldGenerateImage(context.eventType)
        ? await this.generateTweetImage(context)
        : undefined;

      return {
        id: `tweet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        author: this.createTweetAuthor(persona, gameContext),
        content: tweetContent.trim().substring(0, 280),
        timestamp: new Date(),
        likes: this.generateRandomEngagement(persona, 'likes'),
        retweets: this.generateRandomEngagement(persona, 'retweets'),
        replies: this.generateRandomEngagement(persona, 'replies'),
        imageUrl,
        context,
      };
    } catch (error) {
      console.error('Tweet generation failed:', error);
      return this.getFallbackTweet(persona, context, gameContext);
    }
  }

  /**
   * Generate dialogue for conversations
   */
  async generateDialogue(request: DialogueRequest): Promise<string> {
    const { type, context, previousMessages } = request;

    let systemPrompt = '';
    switch (type) {
      case 'PressConference':
        systemPrompt = AI_PROMPTS.pressConference.system;
        break;
      case 'Transfer':
        systemPrompt = AI_PROMPTS.transferNegotiation.system;
        break;
      case 'PlayerConversation':
        systemPrompt = AI_PROMPTS.playerConversation.system;
        break;
      default:
        systemPrompt = 'You are having a football-related conversation.';
    }

    const conversationHistory = previousMessages.slice(-5).join('\n');
    const contextPrompt = `
Previous conversation:
${conversationHistory}

Current game context:
- Team: ${context.gameState.currentTeam.name}
- Recent form: ${context.teamForm}/10
- Manager reputation: ${context.gameState.reputation}

Generate the next response in this conversation. Be natural and context-aware.
`;

    try {
      return await this.makeGeminiRequest(contextPrompt, systemPrompt, 0.85);
    } catch (error) {
      console.error('Dialogue generation failed:', error);
      return 'I understand. Let\'s discuss this further.';
    }
  }

  /**
   * Generate match events using AI logic
   */
  async generateMatchEvent(
    minute: number,
    homeTeam: any,
    awayTeam: any,
    currentScore: [number, number],
    momentum: number
  ): Promise<any> {
    const systemPrompt = `You are a football match simulation engine. Based on team strengths, tactics, and current momentum, determine what happens next in the match.`;

    const contextPrompt = `
Minute: ${minute}
Score: ${homeTeam.name} ${currentScore[0]} - ${currentScore[1]} ${awayTeam.name}
Home Team Rating: ${homeTeam.overallRating}
Away Team Rating: ${awayTeam.overallRating}
Current Momentum: ${momentum > 0 ? homeTeam.name : awayTeam.name} (${Math.abs(momentum)}/100)

What event happens next? Respond with JSON:
{
  "type": "Goal" | "Shot" | "Corner" | "Foul" | "Card" | "Nothing",
  "team": "home" | "away",
  "player": "player name",
  "description": "brief description"
}
`;

    try {
      const response = await this.makeGeminiRequest(contextPrompt, systemPrompt, 0.7);
      return JSON.parse(response);
    } catch (error) {
      console.error('Match event generation failed:', error);
      return { type: 'Nothing', description: 'Play continues' };
    }
  }

  // ==================== HELPER METHODS ====================

  private calculateExcitementLevel(eventType: string): number {
    const excitementMap: Record<string, number> = {
      'Goal': 10,
      'Penalty': 9,
      'RedCard': 8,
      'MissedPenalty': 7,
      'Shot': 6,
      'Corner': 4,
      'Foul': 3,
    };
    return excitementMap[eventType] || 5;
  }

  private getFallbackCommentary(event: any, language: 'en' | 'tr'): string {
    if (language === 'tr') {
      return `${event.minute}. dakika: ${event.description}`;
    }
    return `Minute ${event.minute}: ${event.description}`;
  }

  private createTweetAuthor(persona: string, gameContext: any): any {
    const usernames: Record<string, string> = {
      'Fan': `${gameContext.gameState.currentTeam.shortName}Fan${Math.floor(Math.random() * 9999)}`,
      'Journalist': `FootballNews${Math.floor(Math.random() * 999)}`,
      'Hater': `CriticFC${Math.floor(Math.random() * 9999)}`,
      'Rival': `Rival${Math.floor(Math.random() * 9999)}`,
      'Player': 'PlayerOfficial',
    };

    return {
      username: usernames[persona] || 'FootballFan',
      displayName: persona === 'Journalist' ? 'Football Insider' : `${persona} Account`,
      type: persona,
      team: persona === 'Fan' ? gameContext.gameState.currentTeam.name : undefined,
      verified: persona === 'Journalist' || persona === 'Player',
    };
  }

  private generateRandomEngagement(persona: string, type: 'likes' | 'retweets' | 'replies'): number {
    const baseRanges: Record<string, [number, number]> = {
      'Fan': [1000, 50000],
      'Journalist': [10000, 200000],
      'Hater': [500, 20000],
      'Rival': [2000, 60000],
      'Player': [50000, 500000],
    };

    const [min, max] = baseRanges[persona] || [100, 10000];
    const multiplier = type === 'likes' ? 1 : type === 'retweets' ? 0.3 : 0.2;

    return Math.floor((Math.random() * (max - min) + min) * multiplier);
  }

  private shouldGenerateImage(eventType: string): boolean {
    const imageEvents = ['Goal', 'Transfer', 'Award', 'MissedPenalty', 'RedCard'];
    return imageEvents.includes(eventType);
  }

  private async generateTweetImage(context: any): Promise<string> {
    // TODO: Implement Nano Banana image generation
    // Placeholder for now
    return `https://placeholder-image.com/tweet/${context.eventType}.jpg`;
  }

  private getFallbackTweet(persona: string, context: any, gameContext: any): Tweet {
    return {
      id: `fallback_${Date.now()}`,
      author: this.createTweetAuthor(persona, gameContext),
      content: `What a match! ${gameContext.gameState.currentTeam.name} showing great spirit! ⚽🔥`,
      timestamp: new Date(),
      likes: 1000,
      retweets: 200,
      replies: 50,
      context,
    };
  }
}

export const geminiService = new GeminiService();
export default GeminiService;
