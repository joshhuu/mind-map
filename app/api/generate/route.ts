// app/api/generate/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { concept, audience } = await req.json();

  if (!concept || !audience) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const prompt = `
You are a creative analogy expert. Generate 5 vivid and relatable analogies to help someone understand the concept of "${concept}" tailored for the audience: "${audience}".

Return the analogies as a plain text numbered list like:
1. ...
2. ...
`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const analogies = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ analogies });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
