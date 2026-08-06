import { streamText, APICallError, createTextStreamResponse, toTextStream, RetryError } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export async function POST(req: Request): Promise<Response> {
  try {
        const prompt =  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."; 

        const openrouter = createOpenRouter({
            apiKey: process.env.AI_API_KEY,
        });

        const result = streamText({
            model: openrouter("google/gemma-4-31b-it:free"),
            prompt,
            onError(error) {
                console.error("Error while streaming Text from AI-Model");
            },
            // maxOutputTokens: 400,
        });
    
        return createTextStreamResponse({
            stream: toTextStream({ stream: result.stream}),
        });
    } 
    catch (error) {
        if (error instanceof RetryError) {
            console.error("High Server Load. Please try again later!");
            return Response.json({ 
                success: false,
                message: "High Server Load. Please try again later!",
            }, {status: 500});
        }
        
        console.error("Server-side problem. Please try again later! ", error);
        return Response.json({ 
            success: false,
            message: "Server-side problem. Please try again later!"
        }, {status: 500});
    }
}