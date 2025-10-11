# ChatLingo - Real-time Chat with Auto-Translation

A beautiful real-time chat application built with Next.js, featuring automatic message translation powered by DeepL and real-time messaging via Ably.

## Features

- 🚀 **Real-time messaging** - Powered by Ably's pub/sub messaging
- 🌍 **Multi-language support** - Translate messages on the fly using DeepL
- 💬 **Beautiful UI** - Modern, responsive chat interface
- 🎨 **User avatars** - Distinct visual identities for chat participants
- ⚡ **Instant translation** - Messages automatically translate to your selected language
- 🔄 **Dynamic language switching** - Change languages and see all messages retranslated

## Supported Languages

- English
- Spanish
- French
- German
- Chinese

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or higher
- npm or yarn package manager
- A [DeepL API key](https://www.deepl.com/pro-api) (Free or Pro tier)
- An [Ably API key](https://ably.com/) (Free tier available)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd chatlingo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory with your API keys:

```env
# DeepL API Key
# Get your API key from https://www.deepl.com/pro-api
DEEPL_API_KEY=your_deepl_api_key_here

# Ably API Key
# Get your API key from https://ably.com/
NEXT_PUBLIC_ABLY_API_KEY=your_ably_api_key_here
```

#### Getting your API keys:

**DeepL API Key:**
1. Go to [DeepL Pro API](https://www.deepl.com/pro-api)
2. Sign up for a free or paid account
3. Navigate to your account settings
4. Copy your API key

**Ably API Key:**
1. Go to [Ably](https://ably.com/)
2. Sign up for a free account
3. Create a new app in the dashboard
4. Copy the API key from the "API Keys" tab

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your chat application.

## How It Works

### Real-time Messaging (Ably)

The application uses Ably's JavaScript SDK to enable real-time pub/sub messaging:

- Each user connects to a shared channel (`chat-channel`)
- Messages are published to the channel and instantly received by all subscribers
- The connection is maintained via WebSockets for low-latency communication

### Automatic Translation (DeepL)

Messages are automatically translated using DeepL's API:

- When a message is received from another user, it's sent to the DeepL translation API
- The original text is preserved and can be retranslated when changing languages
- Translation happens asynchronously without blocking the UI
- Your own messages are not translated (shown in original form)

### Architecture

```
├── app/
│   ├── api/
│   │   └── translate/
│   │       └── route.ts          # DeepL translation API endpoint
│   ├── page.tsx                   # Main chat interface with Ably integration
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── package.json                   # Dependencies
└── README.md                      # This file
```

## Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Ably** - Real-time messaging platform
- **DeepL** - Professional translation API

## Usage

1. **Send messages** - Type in the input box and click Send or press Enter
2. **Change language** - Click on any language button to translate all messages
3. **Real-time updates** - Open multiple browser windows to see messages sync in real-time

## Customization

### Adding More Languages

Edit the `languages` array in `app/page.tsx`:

```typescript
const languages = [
  { code: 'en-US', label: 'English', deeplCode: 'en-US' },
  { code: 'es', label: 'Spanish', deeplCode: 'es' },
  // Add more languages here
];
```

Refer to [DeepL's supported languages](https://developers.deepl.com/docs/resources/supported-languages) for language codes.

### Customizing the UI

The application uses Tailwind CSS for styling. You can customize:

- Colors in the `className` attributes
- Avatar styles and gradients
- Message bubble appearance
- Layout and spacing

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Ensure your platform supports:
- Next.js 15+
- Environment variables
- Server-side API routes

## API Costs

- **Ably**: Free tier includes 6 million messages/month
- **DeepL**: Free tier includes 500,000 characters/month

Monitor your usage to avoid unexpected charges.

## Troubleshooting

### Translation not working
- Verify your `DEEPL_API_KEY` is correct
- Check the browser console for error messages
- Ensure you haven't exceeded your DeepL API limits

### Real-time messaging not working
- Verify your `NEXT_PUBLIC_ABLY_API_KEY` is correct
- Check that the API key has the correct permissions (publish and subscribe)
- Open browser console to see connection status

### Messages not appearing
- Check that Ably connection is established
- Verify no console errors
- Try refreshing the page

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Ably Documentation](https://ably.com/docs)
- [DeepL API Documentation](https://developers.deepl.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
