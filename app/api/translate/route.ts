import { NextRequest, NextResponse } from 'next/server';
import * as deepl from 'deepl-node';

// Initialize DeepL client
// Note: You'll need to set DEEPL_API_KEY in your environment variables
const deeplClient = process.env.DEEPL_API_KEY 
  ? new deepl.Translator(process.env.DEEPL_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!deeplClient) {
      return NextResponse.json(
        { error: 'DeepL API key not configured' },
        { status: 500 }
      );
    }

    const { text, targetLang, sourceLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Translate the text
    const result = await deeplClient.translateText(
      text,
      sourceLang || null,
      targetLang as deepl.TargetLanguageCode
    );

    // translateText returns a single TextResult when given a single string
    const translationResult = Array.isArray(result) ? result[0] : result;

    return NextResponse.json({
      translatedText: translationResult.text,
      detectedSourceLang: translationResult.detectedSourceLang,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

