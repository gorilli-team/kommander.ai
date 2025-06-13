
import openai from '@/backend/lib/openai';
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist';
import mammoth from 'mammoth';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

const CHUNK_SIZE = 1500; 
const CHUNK_OVERLAP = 200; 

async function summarizeText(text: string): Promise<string> {
  if (!text.trim()) return "";
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
      messages: [
        {
          role: 'system',
          content: 'You are an expert summarizer. Provide a concise summary of the following text.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 150, 
    });
    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error summarizing text with OpenAI:', error);
    if (error instanceof Error) {
        throw new Error(`OpenAI summarization failed: ${error.message}`);
    }
    throw new Error('OpenAI summarization failed with an unknown error.');
  }
}

export async function parseDocument(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
): Promise<{ chunks?: Array<{ text: string; summary: string }>; fullSummary?: string; error?: string }> {
  let rawText = '';

  try {
    if (fileType === 'application/pdf') {
      const data = new Uint8Array(fileBuffer);
      const pdf = await getDocument({ data }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        rawText += textContent.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
      }
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      rawText = result.value;
    } else if (fileType === 'text/plain') {
      rawText = fileBuffer.toString('utf-8');
    } else {
      return { error: `Unsupported file type: ${fileType}` };
    }
  } catch (err) {
    console.error(`Error processing document content for ${fileName}:`, err);
    let errorMessage = `Failed to parse content from file ${fileName}.`;
    if (err instanceof Error) {
        errorMessage = `Failed to parse content from file ${fileName}: ${err.message}`;
    }
    return { error: errorMessage };
  }

  if (!rawText.trim()) {
    return { error: `No text content found in ${fileName}.` };
  }

  try {
    const textChunks: string[] = [];
    for (let i = 0; i < rawText.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
      textChunks.push(rawText.substring(i, i + CHUNK_SIZE));
    }

    const summarizedChunks: Array<{ text: string; summary: string }> = [];
    for (const chunk of textChunks) {
      const summary = await summarizeText(chunk); 
      summarizedChunks.push({ text: chunk, summary });
    }

    let fullSummary = '';
    if (summarizedChunks.length > 0) {
        const allSummaries = summarizedChunks.map(s => s.summary).join('\n\n');
        if (allSummaries.length > CHUNK_SIZE * 1.5) { 
            fullSummary = await summarizeText(`Summarize the following collection of summaries cohesively:\n${allSummaries}`); 
        } else {
            fullSummary = allSummaries;
        }
    }
    return { chunks: summarizedChunks, fullSummary };
  } catch (summarizationError) {
    console.error(`Error during summarization for ${fileName}:`, summarizationError);
    let errorMessage = `Failed during summarization for file ${fileName}.`;
    if (summarizationError instanceof Error) {
      errorMessage = `Summarization error for ${fileName}: ${summarizationError.message}`;
    }
    return { error: errorMessage }; 
  }
}
