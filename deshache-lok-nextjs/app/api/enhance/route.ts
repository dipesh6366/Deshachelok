import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { getAuthenticatedUser } from '@/lib/auth-server';
import { enhanceInputSchema } from '@/lib/validation';

// Requires auth: this calls a paid Gemini API, so it shouldn't be callable
// by anyone who finds the URL. rawContent is also length-capped by
// enhanceInputSchema to bound cost per call.
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { rawContent } = enhanceInputSchema.parse(body);

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are an expert AI Editor for a digital newspaper called "Deshache Lok" (देशाचे लोक). 
Given the following raw article content, enhance it and structure it into a professional publication-ready format.
The output MUST be a valid JSON object matching the following structure exactly (do not wrap in markdown code blocks like \`\`\`json):

{
  "headline": "A compelling news headline",
  "subtitle": "A descriptive subtitle",
  "summary": "A brief summary of the article",
  "content": "The enhanced article content in Markdown format. Use a highly rich, premium journalistic style. Incorporate various Markdown formatting elements extensively: proper headings (##, ###), bold text for key points, italics for emphasis, highlighted blockquotes (>) for quotes or key takeaways, bulleted or numbered lists for readability, and horizontal rules (---) to separate sections. Make the article look highly professional, engaging, and visually dynamic. Fix any grammar or spelling issues and ensure a professional journalistic tone.",
  "seoTitle": "A title optimized for SEO (max 60 chars)",
  "seoDescription": "A meta description optimized for SEO (max 160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "slug": "url-friendly-slug-based-on-headline",
  "altText": "An alt text for the main image (if applicable, otherwise generic placeholder)",
  "imageCaption": "A caption for the main image (if applicable, otherwise generic placeholder)"
}

Raw Article Content:
"""
${rawContent}
"""

Ensure the response is ONLY raw JSON. Do not include any extra text before or after the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No response from Gemini');
    }

    const enhancedData = JSON.parse(responseText);
    return NextResponse.json(enhancedData);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.flatten() }, { status: 400 });
    }
    console.error('Error enhancing article:', error);
    return NextResponse.json({ error: 'Failed to enhance article using AI' }, { status: 500 });
  }
}
