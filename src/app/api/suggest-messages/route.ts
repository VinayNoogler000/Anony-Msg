import { streamText, APICallError, createTextStreamResponse, toTextStream, RetryError } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export async function POST() {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const openrouter = createOpenRouter({
        apiKey: process.env.AI_API_KEY,
    });

    const result = streamText({
        model: openrouter("openai/gpt-oss-20b:free"),
        prompt,
        onError(error) {
            const err = error.error as Error;
            console.log("Streaming Error [api/suggest-messages/route.ts]: ", `${err.name} ---- ${err.cause} ---- ${err.message}`);
        },
        maxOutputTokens: 300,
        providerOptions: { // OpenRouter fallback configuration
            openrouter: {
                extraBody: {
                    models: [
                        'google/gemma-4-31b-it:free',
                        'google/gemma-4-26b-a4b-it:free',
                        'nvidia/nemotron-3.5-content-safety:free',
                        'nvidia/nemotron-3-ultra-550b-a55b:free',
                        'inclusionai/ling-3.0-tiny:free'
                    ],
                },
            },
        },
    });

    return createTextStreamResponse({
        status: 200,
        stream: toTextStream({ stream: result.stream }),
    });
}