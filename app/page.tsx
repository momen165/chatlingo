'use client';

import { useEffect, useState, useRef } from 'react';
import * as Ably from 'ably';

interface Message {
  id: string;
  sender: string;
  text: string;
  originalText?: string;
  timestamp: number;
}

const languages = [
  { code: 'en-US', label: 'English', deeplCode: 'en-US' },
  { code: 'es', label: 'Spanish', deeplCode: 'es' },
  { code: 'fr', label: 'French', deeplCode: 'fr' },
  { code: 'de', label: 'German', deeplCode: 'de' },
  { code: 'zh', label: 'Chinese', deeplCode: 'zh' },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [currentUser, setCurrentUser] = useState('Liam');
  const [ablyClient, setAblyClient] = useState<Ably.Realtime | null>(null);
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Ably
  useEffect(() => {
      // Note: In production, you should use token authentication
      // For now, using a demo API key (replace with your own)
      const client = new Ably.Realtime({
        key: process.env.NEXT_PUBLIC_ABLY_API_KEY || 'demo-key',
        clientId: currentUser,
      });

    const chatChannel = client.channels.get('chat-channel');

    // Subscribe to messages
    chatChannel.subscribe((message) => {
      const messageData = message.data as { sender: string; text: string; originalText?: string };
      
      // Only translate if message is from another user
      if (messageData.sender !== currentUser) {
        translateMessage(messageData.text, messageData.originalText).then((translatedText) => {
          const newMessage: Message = {
            id: message.id || Date.now().toString(),
            sender: messageData.sender,
            text: translatedText,
            originalText: messageData.originalText || messageData.text,
            timestamp: message.timestamp || Date.now(),
          };
          setMessages((prev) => [...prev, newMessage]);
        });
      } else {
        const newMessage: Message = {
          id: message.id || Date.now().toString(),
          sender: messageData.sender,
          text: messageData.text,
          originalText: messageData.originalText,
          timestamp: message.timestamp || Date.now(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    setAblyClient(client);
    setChannel(chatChannel);

    // Add some demo messages
    const demoMessages: Message[] = [
      {
        id: '1',
        sender: 'Sophia',
        text: "Hey! How's it going?",
        timestamp: Date.now() - 240000,
      },
      {
        id: '2',
        sender: 'Liam',
        text: 'Not bad, just finished a workout. You?',
        timestamp: Date.now() - 180000,
      },
      {
        id: '3',
        sender: 'Sophia',
        text: 'Just chilling at home. Thinking of watching a movie later.',
        timestamp: Date.now() - 120000,
      },
      {
        id: '4',
        sender: 'Liam',
        text: 'Sounds fun! What are you thinking of watching?',
        timestamp: Date.now() - 60000,
      },
      {
        id: '5',
        sender: 'Sophia',
        text: 'Maybe a comedy? Something lighthearted.',
        timestamp: Date.now() - 30000,
      },
      {
        id: '6',
        sender: 'Liam',
        text: 'Nice! Any recommendations?',
        timestamp: Date.now() - 10000,
      },
    ];
    setMessages(demoMessages);

    return () => {
      chatChannel.unsubscribe();
      client.close();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const translateMessage = async (text: string, originalText?: string): Promise<string> => {
    // If selected language is English or translation is disabled, return original
    if (selectedLanguage === 'en-US') {
      return text;
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText || text,
          targetLang: languages.find(l => l.code === selectedLanguage)?.deeplCode,
          sourceLang: null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.translatedText;
      }
    } catch (error) {
      console.error('Translation failed:', error);
    }

    return text;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !channel) return;

    const messageData = {
      sender: currentUser,
      text: inputMessage,
      originalText: inputMessage,
    };

    await channel.publish('message', messageData);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Retranslate all messages when language changes
  useEffect(() => {
    const retranslateMessages = async () => {
      const updatedMessages = await Promise.all(
        messages.map(async (msg) => {
          if (msg.sender !== currentUser && msg.originalText) {
            const translatedText = await translateMessage(msg.originalText, msg.originalText);
            return { ...msg, text: translatedText };
          }
          return msg;
        })
      );
      setMessages(updatedMessages);
    };

    if (messages.length > 0) {
      retranslateMessages();
    }
  }, [selectedLanguage]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ChatterBox</h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            <button className="text-gray-700 hover:text-gray-900 font-medium">Home</button>
            <button className="text-gray-700 hover:text-gray-900 font-medium">Profile</button>
            <button className="text-gray-700 hover:text-gray-900 font-medium">Settings</button>
          </nav>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
            {currentUser[0]}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === currentUser ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold ${
                message.sender === currentUser
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                  : 'bg-gradient-to-br from-pink-400 to-rose-500'
              }`}
            >
              {message.sender[0]}
            </div>

            {/* Message Content */}
            <div
              className={`flex flex-col ${
                message.sender === currentUser ? 'items-end' : 'items-start'
              }`}
            >
              <span className="text-sm font-semibold text-gray-700 mb-1">
                {message.sender}
              </span>
              <div
                className={`px-4 py-3 rounded-2xl max-w-md ${
                  message.sender === currentUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Language Selection */}
      <div className="px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex gap-3 flex-wrap">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedLanguage === lang.code
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Send
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
