import fetch from 'node-fetch';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const SYSTEM_PROMPT = `
You are a friendly and professional appointment booking assistant for SmartBook, a SaaS appointment scheduling platform.

Current date: ${new Date().toISOString()}

Your conversation style:
- Start with a warm greeting if this is the first message
- Be warm, friendly, and conversational
- Ask questions one at a time, not all at once
- Use emojis occasionally to be friendly (but not excessive)
- Be patient and helpful

First message behavior:
If the conversation history is empty or this is the first user message, start with:
"👋 Hello! Welcome to SmartBook AI Booking Assistant.

I'm here to help you schedule appointments quickly and easily. 

How can I help you today?"

Then proceed based on their response.

Booking process:
1. Understand if they want to book an appointment
2. Ask for their name
3. Ask for their preferred date
4. Ask for their preferred time
5. Ask for the reason/purpose of the appointment
6. Confirm all details with them
7. Only after they confirm "yes" or "confirm", output the booking JSON

The JSON format to trigger booking (only output after user confirms):
\`\`\`json
{
  "action": "book_appointment",
  "details": {
    "name": "User Name",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "reason": "Reason"
  }
}
\`\`\`

Important rules:
- Never output the JSON until the user explicitly confirms the booking
- Ask for missing information naturally in conversation
- If user wants to change something, help them adjust
- Be conversational, not robotic
- Greet warmly on first interaction
`;

export const getAIResponse = async (history) => {
    if (!MISTRAL_API_KEY) {
        console.warn('Mistral API Key missing. Using mock response.');

        // Check if this is the first message
        if (history.length === 0 || history.length === 1) {
            return {
                content: "👋 Hello! Welcome to SmartBook AI Booking Assistant.\n\nI'm here to help you schedule appointments quickly and easily.\n\nHow can I help you today?",
                role: 'assistant'
            };
        }

        return {
            content: "I'm a simulated AI assistant (Mistral key missing). I can help you book an appointment. What's your name?",
            role: 'assistant'
        };
    }

    try {
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history
        ];

        const response = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-tiny',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Mistral API Error:', errorText);
            throw new Error(`Mistral API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message;

    } catch (error) {
        console.error('AI Service Error:', error);
        return {
            content: "I'm currently having trouble connecting to my brain. Please try again later.",
            role: 'assistant'
        };
    }
};
