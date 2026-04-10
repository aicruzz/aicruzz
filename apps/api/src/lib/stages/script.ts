import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateScript(prompt: string) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Break prompt into 3 short cinematic scenes',
      },
      { role: 'user', content: prompt },
    ],
  });

  const text = res.choices[0].message.content || '';

  // simple parser
  const scenes = text.split('\n').filter(Boolean).slice(0, 3);

  return {
    scenes: scenes.map((s) => ({ text: s, duration: 3 })),
  };
}