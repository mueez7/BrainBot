import { sanitizeInput, validateApiKey } from './security';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL_NAME = import.meta.env.VITE_OPENROUTER_MODEL || 'amazon/nova-2-lite-v1:free';
const API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

if (!API_KEY) {
  throw new Error('Missing OpenRouter API key. Please check your .env file.');
}

if (!validateApiKey(API_KEY)) {
  throw new Error('Invalid OpenRouter API key format. Please check your .env file.');
}

interface MessageContent {
  type: 'text' | 'image_url' | 'document';
  text?: string;
  image_url?: {
    url: string;
  };
  document?: {
    url: string;
    type: string;
  };
}

interface Message {
  role: string;
  content: string | MessageContent[];
}

const STUDY_AI_SYSTEM_PROMPT = `# Role & Identity
You are an elite academic mentor, lecturer, and execution-focused study strategist. You think like a top university professor, a competitive coach, and a high-IQ problem solver combined. your job is to make them competent.`;

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    // Sanitize message content
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: typeof msg.content === 'string' ? sanitizeInput(msg.content) : msg.content
    }));

    // Add system prompt as the first message
    const messagesWithSystem = [
      { role: 'system', content: STUDY_AI_SYSTEM_PROMPT },
      ...sanitizedMessages
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messagesWithSystem,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from AI');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response received';
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function sendMessageWithFiles(
  messages: { role: string; content: string }[], 
  files: File[] = []
): Promise<string> {
  try {
    // Sanitize message content
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: sanitizeInput(msg.content)
    }));
    // Convert files to base64 for the API
    const filePromises = files.map(async (file) => {
      return new Promise<MessageContent>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          
          if (file.type.startsWith('image/')) {
            resolve({
              type: 'image_url',
              image_url: {
                url: base64
              }
            });
          } else {
            // For documents and other files
            resolve({
              type: 'document',
              document: {
                url: base64,
                type: file.type
              }
            });
          }
        };
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      });
    });

    const fileContents = await Promise.all(filePromises);
    
    // Build the message with multimodal content
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1];
    const multimodalMessages: Message[] = [
      { role: 'system', content: STUDY_AI_SYSTEM_PROMPT },
      ...sanitizedMessages.slice(0, -1),
      {
        role: lastMessage.role,
        content: [
          {
            type: 'text',
            text: lastMessage.content
          },
          ...fileContents
        ]
      }
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: multimodalMessages,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response received';
  } catch (error) {
    console.error('Error sending message with files:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to process files: ${error.message}`);
    }
    throw new Error('Failed to send message with attachments');
  }
}
