import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/utils/chat/knowledge';
import { GoogleGenAI } from '@google/genai';


const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: API_KEY });

export async function POST(req: Request) {
    const { message } = await req.json();

    try {
        const client = new GoogleGenAI({ apiKey: API_KEY });

        const response = await genAI.models.generateContent({
            model: 'gemini-3.1-flash-lite', 
            contents: message,         
            config: {
                systemInstruction: SYSTEM_PROMPT, 
                temperature: 0.7, 
            }
        });
        const responseText = response.text;

        return NextResponse.json({ reply: responseText });

    } catch (error) {
        console.error('Gagal mengirim pesan ke AI:', error);
        return NextResponse.json({ error: 'Gagal terhubung ke server.' }, { status: 500 });
    }
}