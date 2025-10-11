# 🚀 Get Started with ChatLingo

Welcome! This guide will help you get your chat application running in just a few minutes.

## What You'll Need (5 minutes)

### 1. DeepL API Key (Free) 🌍
- Go to: https://www.deepl.com/pro-api
- Click "Sign up for free"
- After signing up, go to **Account** → **API Keys**
- Copy your Authentication Key

**Free tier includes**: 500,000 characters/month

### 2. Ably API Key (Free) ⚡
- Go to: https://ably.com/
- Click "Sign up" (free account)
- Create a new app (e.g., "ChatLingo")
- Go to **API Keys** tab
- Copy the "Root key" (starts with something like `xxxxxx.xxxxxx:xxxxxxxxxx`)

**Free tier includes**: 6 million messages/month and 200 concurrent connections

## Setup (2 minutes)

### Step 1: Create Environment File

In your project root, create a file called `.env.local`:

```bash
# On Windows (PowerShell)
New-Item .env.local

# On Mac/Linux
touch .env.local
```

### Step 2: Add Your API Keys

Open `.env.local` and paste:

```env
DEEPL_API_KEY=your_deepl_key_here
NEXT_PUBLIC_ABLY_API_KEY=your_ably_key_here
```

Replace the placeholder values with your actual API keys.

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Application

```bash
npm run dev
```

Visit: **http://localhost:3000**

## 🎉 You're Ready!

The chat interface should now be running. You'll see:
- A beautiful chat interface with demo messages
- Language selection buttons at the bottom
- A message input box

## Testing Real-time Chat

1. **Open two browser windows** side by side at http://localhost:3000
2. **Type a message** in one window
3. **Watch it appear** instantly in the other window
4. **Click a language** button (e.g., Spanish or French)
5. **See all messages translate** automatically!

## Features to Try

### 💬 Send Messages
- Type in the input box
- Press Enter or click "Send"
- Messages appear with your avatar

### 🌍 Switch Languages
- Click any language button (English, Spanish, French, German, Chinese)
- All messages automatically retranslate
- Your own messages stay in the original language

### 👥 Multiple Users
- Open multiple browser tabs
- Each shows the same conversation in real-time
- Change languages independently in each tab

## Common Issues

### "DeepL API key not configured"
- Double-check `.env.local` exists in the project root
- Verify `DEEPL_API_KEY` is spelled correctly
- Make sure there are no extra spaces
- Restart the dev server (`npm run dev`)

### "Ably connection failed"
- Verify `NEXT_PUBLIC_ABLY_API_KEY` in `.env.local`
- Check the key starts with `NEXT_PUBLIC_`
- Make sure you copied the complete key from Ably
- Restart the dev server

### Messages not appearing in other windows
- Check browser console for errors (F12)
- Verify Ably API key has "Publish" and "Subscribe" capabilities
- Try refreshing both windows

### Translation not working
- Verify you have DeepL API credits remaining
- Check browser console for errors
- Make sure the source language is different from the target

## Architecture Overview

```
┌─────────────────────────────────────┐
│  Browser 1                          │
│  ┌─────────────────────────────┐   │
│  │ React Components            │   │
│  │ (page.tsx)                  │   │
│  └─────────────────────────────┘   │
│           ↕                         │
│  ┌─────────────────────────────┐   │
│  │ Ably Client                 │   │
│  │ (Real-time WebSocket)       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
            ↕
    ┌───────────────┐
    │  Ably Cloud   │ ← Real-time message distribution
    │   Service     │
    └───────────────┘
            ↕
┌─────────────────────────────────────┐
│  Browser 2                          │
│  (Receives messages in real-time)  │
└─────────────────────────────────────┘

For Translation:
Browser → Next.js API (/api/translate) → DeepL API → Translated Text → Browser
```

## What's Happening Behind the Scenes?

1. **Real-time Messaging**: When you send a message, it's published to Ably's cloud. Ably instantly pushes it to all connected clients via WebSocket.

2. **Translation**: When a message arrives from another user, it's sent to your Next.js API route, which calls DeepL's API to translate it to your selected language.

3. **Language Switching**: When you change languages, all messages are retranslated using their stored original text.

## Next Steps

- **Customize the UI**: Edit `app/page.tsx` and modify Tailwind classes
- **Add more languages**: See README.md for instructions
- **Deploy to production**: Follow the deployment guide in README.md
- **Add user authentication**: Integrate with services like Clerk or Auth0

## Need More Help?

- 📖 Full documentation: [README.md](./README.md)
- 🔧 Quick troubleshooting: [SETUP.md](./SETUP.md)
- 📚 Ably docs: https://ably.com/docs
- 📚 DeepL docs: https://developers.deepl.com/docs

## Enjoy Your Chat App! 🎊

You now have a fully functional real-time chat application with automatic translation. Feel free to customize it and make it your own!

