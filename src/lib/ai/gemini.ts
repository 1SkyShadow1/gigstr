const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash-latest';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type ProposalPrompt = {
  jobDescription: string;
  outcomes?: string;
  budget?: string;
  timeline?: string;
  tone: 'professional' | 'persuasive' | 'casual' | 'urgent';
  length: 'concise' | 'detailed';
  portfolio?: string;
  clientName?: string;
  userHandle?: string;
};

type GeminiPart = { text?: string };
type GeminiCandidate = { content?: { parts?: GeminiPart[] } };

// Minimal type guard for Gemini responses
function extractTextFromCandidates(response: any): string | null {
  const candidate: GeminiCandidate | undefined = response?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (!parts || !Array.isArray(parts)) return null;
  const textParts = parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .filter(Boolean);
  return textParts.length ? textParts.join('\n') : null;
}

export async function generateProposalWithGemini(prompt: ProposalPrompt, signal?: AbortSignal): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your environment.');
  }

  const promptText = [
    'You are an expert freelance proposal writer. Write a persuasive, scoped proposal that is ready to send.',
    `Tone: ${prompt.tone}. Length: ${prompt.length}.`,
    prompt.clientName ? `Client name: ${prompt.clientName}.` : null,
    prompt.outcomes ? `Outcomes to emphasize: ${prompt.outcomes}.` : null,
    prompt.timeline ? `Timeline target: ${prompt.timeline}.` : null,
    prompt.budget ? `Budget context: ${prompt.budget}.` : null,
    prompt.portfolio ? `Portfolio links: ${prompt.portfolio}.` : null,
    `Job description: ${prompt.jobDescription}`,
    '',
    'Include: 1) opening that mirrors the need, 2) concise plan with 4-6 bullets, 3) risks/guardrails, 4) why me (brief), 5) clear next steps.',
    'Use short paragraphs and bullet lists. Return only the proposal text, no markdown fences.'
  ]
    .filter(Boolean)
    .join('\n');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error?.message || `Gemini request failed (${response.status})`;
      throw new Error(message);
    }

    const data = await response.json();
    const text = extractTextFromCandidates(data);
    if (!text) {
      throw new Error('Gemini returned no content.');
    }
    return text.trim();
  } finally {
    clearTimeout(timeout);
  }
}
