
'use server';

import { connectToDatabase } from '@/backend/lib/mongodb';
import openai from '@/backend/lib/openai';
import { buildPromptServer, type ChatMessage } from '@/backend/lib/buildPromptServer';
import type { Faq } from '@/backend/schemas/faq';

interface DocumentSummaryForPrompt {
  fileName: string;
  chunks: Array<{ text: string; summary: string }>;
  fullSummary?: string;
}


export async function generateChatResponse(
  userMessage: string,
  history: ChatMessage[]
): Promise<{ response?: string; error?: string }> {
  if (!userMessage.trim()) {
    return { error: 'Message cannot be empty.' };
  }

  try {
    const { db } = await connectToDatabase();
    
    const faqsCursor = await db.collection('faqs').find({}).limit(10).toArray();
    const faqs: Faq[] = faqsCursor.map(doc => ({
        id: doc._id.toString(),
        question: doc.question,
        answer: doc.answer,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    }));

    const docSummariesCursor = await db.collection('document_summaries').find({}).sort({ uploadedAt: -1 }).limit(3).toArray();
    const docSummaries: DocumentSummaryForPrompt[] = docSummariesCursor.map(doc => ({
        fileName: doc.fileName,
        chunks: doc.chunks, 
        fullSummary: doc.fullSummary,
    }));

    const messages = buildPromptServer(userMessage, faqs, docSummaries, history);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantResponse = completion.choices[0]?.message?.content;

    if (!assistantResponse) {
      return { error: 'AI did not return a response.' };
    }

    return { response: assistantResponse.trim() };

  } catch (error) {
    console.error('Error generating chat response:', error);
    return { error: 'Failed to generate chat response due to a server error.' };
  }
}
