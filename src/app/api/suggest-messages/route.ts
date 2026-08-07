import { streamText, createTextStreamResponse, AISDKError } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { NextResponse } from 'next/server';
import { getErrorMessage, getStatusCode } from '@/helpers/error';

export async function POST() {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Without any quotation marks, whether single or double quotes. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const openrouter = createOpenRouter({
        apiKey: process.env.AI_API_KEY,
        appName: "AnonyMsg"
    });

    const models:string[] = [
        'cohere/north-mini-code:free',
        'poolside/laguna-xs-2.1:free',
        'poolside/laguna-s-2.1:free',
        'google/gemma-4-26b-a4b-it:free',
        'inclusionai/ling-3.0-tiny:free',
        "openai/gpt-oss-20b:free",
        'google/gemma-4-31b-it:free',
    ]
    
    let maxOutputTokens = 400;
    let err:Error | any = null;

    for (const model of models) {
        try {
            const result = streamText({
                model: openrouter(model),
                prompt,
                onError({error}) {
                    err = error as Error;
                    console.log(`----Streaming Error [${model}]: `, err.message, "----");
                },
                maxOutputTokens,
                maxRetries: 0,
            });
            

            // Read the first chunk to ensure the stream connection is healthy
            const reader = result.textStream.getReader();
            const { value, done } = await reader.read();

            // Release the reader lock so the stream can continue consuming
            reader.releaseLock();

            // If we successfully received the first chunk (or empty completed stream), return it
            if (!done || value) {
                return createTextStreamResponse({
                    status: 200,
                    stream: result.textStream,
                });
            }
            
            console.warn(`Model ${model} hit token limit (finishReason: length). Trying next model...`);
            
            // Doubles the Output Token Limit if the streaming failed due to lower limit of output token
            const finishReason = await result.finishReason; 
            if (finishReason === "length") {
                maxOutputTokens *= 2;
                console.log("Max Output Tokens increased to", maxOutputTokens);
            }
        }
        catch (error) {
            err = error;

            // Catches AI_RetryError, AI_APICallError, Rate Limit, or Upstream Errors
            if (AISDKError.isInstance(error)) {
                console.error(`[${model}] failed with error:`, error);
                // return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: getStatusCode(error) });
            }
            else {
                // General error handling
                console.error('An unexpected error occurred:', error);
                throw error;
            }
        }
    }
    
    return NextResponse.json({ success: false, message: getErrorMessage(err) }, { status: getStatusCode(err) });
}