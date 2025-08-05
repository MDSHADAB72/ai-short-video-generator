import { chatSession } from "@/configs/AiModel"
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        console.log('Received prompt:', prompt);

        const result = await chatSession.sendMessage(prompt);
        
        // Since result.response.text() is a promise, we need to await it
        const responseText = await result.response.text();
        console.log('AI Response:', responseText);

        try {
            const parsedResponse = JSON.parse(responseText);
            return NextResponse.json({ result: parsedResponse });
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return NextResponse.json(
                { error: 'Failed to parse AI response' },
                { status: 500 }
            );
        }
    } catch (e) {
        console.error('API error:', e);
        return NextResponse.json(
            { error: e.message || 'Internal server error' },
            { status: 500 }
        );
    }
}