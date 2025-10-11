# Quick Setup Guide

## Step 1: Get Your API Keys

### DeepL API Key
1. Visit: https://www.deepl.com/pro-api
2. Sign up (free tier available - 500,000 characters/month)
3. Go to Account → API Keys
4. Copy your API key

### Ably API Key
1. Visit: https://ably.com/
2. Sign up (free tier available - 6M messages/month)
3. Create a new app in the dashboard
4. Go to "API Keys" tab
5. Copy your API key (Root key)

## Step 2: Create .env.local file

In the root of your project, create a file named `.env.local` with:

```env
DEEPL_API_KEY=your_deepl_key_here
NEXT_PUBLIC_ABLY_API_KEY=your_ably_key_here
```

## Step 3: Install and Run

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## Testing Real-time Features

1. Open http://localhost:3000 in two different browser windows
2. Type a message in one window
3. See it appear instantly in the other window
4. Change language to see automatic translation

## Troubleshooting

**Issue**: "DeepL API key not configured"
- **Solution**: Make sure `.env.local` exists and has the correct `DEEPL_API_KEY`

**Issue**: Messages not syncing between windows
- **Solution**: Check that `NEXT_PUBLIC_ABLY_API_KEY` is set correctly and the API key has publish/subscribe permissions

**Issue**: Translation not working
- **Solution**: 
  - Verify DeepL API key is valid
  - Check you haven't exceeded free tier limits
  - Open browser console for error messages

## Need Help?

See the full [README.md](./README.md) for detailed documentation.

