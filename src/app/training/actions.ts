
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/backend/lib/mongodb';
import { FaqSchema, type Faq } from '@/backend/schemas/faq';
import { parseDocument } from '@/backend/lib/parseDocs';
import { ObjectId } from 'mongodb';

// FAQ Types
export type FaqDisplayItem = Omit<Faq, 'createdAt' | 'updatedAt'> & {
  createdAt?: string;
  updatedAt?: string;
};

// Document Types
export type DocumentDisplayItem = {
  id: string;
  fileName: string;
  originalFileType: string;
  uploadedAt?: string; 
};


// FAQ Actions
export async function createFaq(data: unknown) {
  const validatedFields = FaqSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields.', details: validatedFields.error.flatten().fieldErrors };
  }

  const { question, answer } = validatedFields.data;

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection<Omit<Faq, 'id'>>('faqs').insertOne({
      question,
      answer,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    revalidatePath('/training');
    return { success: 'FAQ created successfully.', id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return { error: 'Database error: Failed to create FAQ.' };
  }
}

export async function getFaqs(): Promise<FaqDisplayItem[]> {
  try {
    const { db } = await connectToDatabase();
    const faqsFromDb = await db.collection('faqs').find({}).sort({ createdAt: -1 }).toArray();
    
    return faqsFromDb.map(faqDbObject => {
      const plainFaq: FaqDisplayItem = {
        id: faqDbObject._id.toString(),
        question: faqDbObject.question,
        answer: faqDbObject.answer,
      };
      if (faqDbObject.createdAt && faqDbObject.createdAt instanceof Date) {
        plainFaq.createdAt = faqDbObject.createdAt.toISOString();
      }
      if (faqDbObject.updatedAt && faqDbObject.updatedAt instanceof Date) {
        plainFaq.updatedAt = faqDbObject.updatedAt.toISOString();
      }
      return plainFaq;
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export async function updateFaq(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
    return { error: 'Invalid FAQ ID.' };
  }
  const validatedFields = FaqSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields.', details: validatedFields.error.flatten().fieldErrors };
  }

  const { question, answer } = validatedFields.data;

  try {
    const { db } = await connectToDatabase();
    await db.collection('faqs').updateOne(
      { _id: new ObjectId(id) },
      { $set: { question, answer, updatedAt: new Date() } }
    );
    revalidatePath('/training');
    return { success: 'FAQ updated successfully.' };
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return { error: 'Database error: Failed to update FAQ.' };
  }
}

export async function deleteFaq(id: string) {
   if (!ObjectId.isValid(id)) {
    return { error: 'Invalid FAQ ID.' };
  }
  try {
    const { db } = await connectToDatabase();
    await db.collection('faqs').deleteOne({ _id: new ObjectId(id) });
    revalidatePath('/training');
    return { success: 'FAQ deleted successfully.' };
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return { error: 'Database error: Failed to delete FAQ.' };
  }
}

// Document Actions
const MaxFileSize = 5 * 1024 * 1024; // 5MB
const AcceptedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];


export async function uploadFileAndProcess(formData: FormData) {
  const file = formData.get('file') as File | null;

  if (!file) {
    return { error: 'No file uploaded.' };
  }

  if (file.size > MaxFileSize) {
    return { error: `File size exceeds ${MaxFileSize / (1024*1024)}MB limit.` };
  }

  if (!AcceptedFileTypes.includes(file.type)) {
    return { error: 'Invalid file type. Only PDF, DOCX, TXT are allowed.' };
  }
  
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer()); // Can throw if file reading fails
    
    // parseDocument returns an object { chunks?, fullSummary?, error? }
    // It handles its internal errors (like OpenAI API issues) and returns them in the `error` field.
    const result = await parseDocument(fileBuffer, file.name, file.type);

    if (result.error) {
      // Pass through specific error from parseDocument (e.g., "OpenAI API key invalid")
      return { error: result.error };
    }

    // Proceed if parseDocument was successful (result.error is undefined)
    const { db } = await connectToDatabase(); // Can throw if DB connection fails
    await db.collection('document_summaries').insertOne({
      fileName: file.name,
      originalFileType: file.type,
      chunks: result.chunks, // Will be undefined if result.error was set, but we check result.error first
      fullSummary: result.fullSummary, 
      uploadedAt: new Date(),
    }); // Can throw if DB write fails
    
    revalidatePath('/training'); 
    return { success: `File "${file.name}" processed and summaries stored.` };

  } catch (error) { 
    // This catch block primarily handles errors from:
    // - file.arrayBuffer()
    // - connectToDatabase()
    // - db.collection('document_summaries').insertOne()
    // - Or any unexpected error not caught and returned by parseDocument
    console.error('Server error during file processing in uploadFileAndProcess:', error);
    let specificMessage = 'An unexpected server error occurred during file processing.';
    if (error instanceof Error) {
      // Add more specific checks here if needed for DB connection errors, file system errors etc.
      // For instance, distinguish network errors from other operational errors.
      specificMessage = `Server error: ${error.message}`;
    }
    return { error: specificMessage };
  }
}

export async function getUploadedFiles(): Promise<DocumentDisplayItem[]> {
  try {
    const { db } = await connectToDatabase();
    const filesFromDb = await db.collection('document_summaries')
      .find({})
      .project({ fileName: 1, originalFileType: 1, uploadedAt: 1 })
      .sort({ uploadedAt: -1 })
      .toArray();
    
    return filesFromDb.map(doc => ({
      id: doc._id.toString(),
      fileName: doc.fileName,
      originalFileType: doc.originalFileType,
      uploadedAt: doc.uploadedAt instanceof Date ? doc.uploadedAt.toISOString() : undefined,
    }));
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    return [];
  }
}

export async function deleteDocument(id: string) {
  if (!ObjectId.isValid(id)) {
    return { error: 'Invalid document ID.' };
  }
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('document_summaries').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        return { error: 'Document not found or already deleted.'}
    }
    revalidatePath('/training');
    return { success: 'Document deleted successfully.' };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { error: 'Database error: Failed to delete document.' };
  }
}
