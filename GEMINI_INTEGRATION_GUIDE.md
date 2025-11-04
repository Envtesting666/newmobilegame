# Gemini AI Integration Guide

## 🎯 Overview

This Football Manager AI game uses **5 core Gemini AI features** as required by Gemini Apps Builder:

1. **Nano Banana** - Visual content generation
2. **Gemini Intelligence** - Core game logic and decisions
3. **AI Chatbot** - Conversations and dialogues
4. **Generate Speech** - Voice commentary and audio
5. **Fast AI Responses** - Real-time updates

---

## 🔑 Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
REACT_APP_GEMINI_API_KEY=your_api_key_here
REACT_APP_USE_AI_COMMENTARY=true
REACT_APP_USE_AI_TWEETS=true
REACT_APP_USE_AI_MATCH_ENGINE=true
```

### 3. Enable Required APIs

In Google Cloud Console, enable:
- Generative Language API (Gemini Pro)
- Text-to-Speech API (for commentary)
- Imagen API (for Nano Banana)

---

## 🤖 Feature Implementation Details

### 1. Nano Banana (Visual Content Generation)

**What it does:** Generates images for:
- Match result graphics
- Player performance cards
- Transfer announcements
- Goal celebrations
- Season achievements

**Implementation:**
```typescript
// src/services/GeminiService.ts
async generateTweetImage(context: any): Promise<string> {
  // Calls Nano Banana API to generate contextual images
}
```

**API Endpoint:**
```
POST https://imagen.googleapis.com/v1/images:generate
```

**Current Status:** ⚠️ Placeholder - Returns mock URLs. Needs Imagen API key.

---

### 2. Gemini Intelligence (Core Game Logic)

**What it does:**
- Match event generation
- Tactical AI for opponent teams
- Dynamic difficulty adjustment
- Transfer market valuations
- Player development predictions

**Implementation:**
```typescript
// src/services/GeminiService.ts
async generateMatchEvent(
  minute: number,
  homeTeam: Team,
  awayTeam: Team,
  currentScore: [number, number],
  momentum: number
): Promise<MatchEvent>
```

**Prompts Used:**
```typescript
{
  systemPrompt: "You are a football match simulation engine...",
  context: {
    minute: 23,
    score: "2-1",
    momentum: 65,
    homeTeam: { rating: 89, tactics: "4-3-3" }
  }
}
```

**Current Status:** ✅ Implemented and working

---

### 3. AI Chatbot (Conversations)

**What it does:**
- Press conference dialogues
- Transfer negotiations
- Player-to-player conversations
- Board meetings
- Agent communications

**Implementation:**
```typescript
// src/services/GeminiService.ts
async generateDialogue(request: DialogueRequest): Promise<string>
```

**Conversation Types:**
1. **Press Conference**
   - Pre-match questions
   - Post-match interviews
   - Crisis management

2. **Transfer Negotiations**
   - Club-to-club offers
   - Player personal terms
   - Agent negotiations

3. **Player Conversations**
   - Morale discussions
   - Playing time complaints
   - Contract renewal talks

**Current Status:** ✅ Structure complete, needs UI integration

---

### 4. Generate Speech (Voice Commentary)

**What it does:**
- Live match commentary in Turkish/English
- Post-match interviews
- Press conference audio
- Stadium announcer simulation

**Implementation:**
```typescript
// src/services/GeminiService.ts
async generateSpeechAudio(text: string, language: 'en' | 'tr'): Promise<string>
```

**Voice Configuration:**
```typescript
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
}
```

**Commentary Triggers:**
- Goal scored
- Near miss
- Yellow/Red card
- Substitution
- Half-time/Full-time
- VAR decision

**Current Status:** ⚠️ Structure ready, needs Text-to-Speech API key

---

### 5. Fast AI Responses (Real-Time)

**What it does:**
- Live Twitter feed updates during matches
- Instant player reactions
- Breaking news notifications
- Quick dialogue responses

**Implementation:**
```typescript
// Optimized for speed with lower temperature and max tokens
parameters: {
  temperature: 0.7, // Lower for faster, more focused responses
  maxOutputTokens: 512, // Reduced for speed
}
```

**Rate Limiting:**
```typescript
rateLimits: {
  requestsPerMinute: 60,
  tokensPerMinute: 100000,
}
```

**Current Status:** ✅ Implemented with retry and backoff logic

---

## 📊 API Usage Examples

### Example 1: Generate Match Commentary

```typescript
const commentary = await geminiService.generateMatchCommentary({
  language: 'en',
  event: {
    minute: 23,
    type: 'Goal',
    player: 'Arda Güler',
    description: 'Long range shot',
  },
  context: gameContext,
  previousCommentary: lastThreeComments,
});

// Result:
// {
//   text: "WHAT A STRIKE! Arda Güler from 25 yards out!
//         The young Turkish sensation has just announced himself
//         to the Santiago Bernabéu with a thunderous goal!",
//   audioUrl: "data:audio/mp3;base64,...",
//   excitement: 10
// }
```

### Example 2: Generate Tweet

```typescript
const tweet = await geminiService.generateTweet({
  persona: 'Fan',
  context: {
    eventType: 'Goal',
    relatedPlayer: 'Arda Güler',
  },
  gameContext,
});

// Result:
// {
//   content: "ARDA GÜLER WHAT A PLAYER! 🚀⚪ That solo run and finish
//            was PURE MAGIC! Real Madrid's future is BRIGHT! #RealMadrid",
//   imageUrl: "https://generated-image-url.jpg",
//   likes: 34200,
//   retweets: 12100
// }
```

### Example 3: Press Conference Dialogue

```typescript
const response = await geminiService.generateDialogue({
  type: 'PressConference',
  context: gameContext,
  previousMessages: [
    "Journalist: Your team lost 4 matches in a row. How do you respond?",
    "Manager: Results will improve. I have full confidence."
  ],
});

// Result:
// "But coach, don't you think tactical changes are needed?
//  The fans are calling for a formation switch. Are you considering
//  moving from 4-3-3 to something more defensive?"
```

---

## 🔧 Configuration Options

### Adjusting AI Creativity

```typescript
// More creative (varied responses)
temperature: 0.9

// More focused (consistent responses)
temperature: 0.5
```

### Adjusting Response Speed

```typescript
// Faster (shorter responses)
maxOutputTokens: 256

// More detailed (longer responses)
maxOutputTokens: 2048
```

### Language Selection

```typescript
// English (La Liga default)
language: 'en'

// Turkish (Süper Lig default)
language: 'tr'
```

---

## 🚨 Error Handling

All AI calls include retry logic:

```typescript
retry: {
  maxAttempts: 3,
  backoffMs: 1000,
  exponential: true, // 1s, 2s, 4s
}
```

Fallback responses are provided if AI fails:

```typescript
if (error) {
  return getFallbackCommentary(event, language);
}
```

---

## 📈 Performance Monitoring

Track AI usage in the console:

```typescript
console.log('Gemini API Stats:', {
  requestCount: geminiService.requestCount,
  lastRequestTime: geminiService.lastRequestTime,
  averageResponseTime: '450ms',
});
```

---

## 🧪 Testing AI Features

### Test Commentary Generation

```bash
# In browser console
await geminiService.generateMatchCommentary({
  language: 'en',
  event: { type: 'Goal', player: 'Test Player', minute: 10 },
  context: mockContext,
  previousCommentary: []
});
```

### Test Tweet Generation

```bash
await geminiService.generateTweet({
  persona: 'Fan',
  context: { eventType: 'Goal' },
  gameContext: mockGameState
});
```

---

## 🎓 Best Practices

1. **Always provide context** - More context = better AI responses
2. **Cache responses** - Don't regenerate identical commentary
3. **Handle failures gracefully** - Always have fallback text
4. **Respect rate limits** - Use the built-in rate limiter
5. **Test with different languages** - Ensure Turkish and English work
6. **Monitor token usage** - Track costs and optimize prompts
7. **Update prompts regularly** - Refine based on output quality

---

## 📞 Support

- Gemini API Documentation: https://ai.google.dev/docs
- Text-to-Speech API: https://cloud.google.com/text-to-speech
- Imagen API: https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview

---

**Last Updated:** 2025-11-04
**Gemini Version:** gemini-pro (latest)
