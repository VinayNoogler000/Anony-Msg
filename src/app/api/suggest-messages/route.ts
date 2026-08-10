import { streamText, createTextStreamResponse, AISDKError} from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { NextResponse } from 'next/server';
import { getErrorMessage, getStatusCode } from '@/helpers/error';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

/* Route behavior:
 * 1. Authenticate the user.
 * 2. Send the request to the primary OpenRouter model.
 * 3. Provide OpenRouter with an ordered list of fallback models.
 * 4. OpenRouter automatically selects a fallback model if the primary
 *    model is unavailable or fails before streaming begins.
 * 5. Pass the client's abort signal to the AI SDK so clicking Stop
 *    can cancel the active model request.
 * 6. Stream the generated text to the client in real time.
 * 7. Return a JSON error response only if the request fails before
 *    the stream response is created.
 *
 * Once streaming has started, the HTTP response status is already 200.
 * A later streaming failure cannot be converted into a different HTTP
 * status or replaced cleanly with another model's response.
 */

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const loggedInUser = session?.user as User;

    if (!session || !loggedInUser) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Without any quotation marks, whether single or double quotes. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const openrouter = createOpenRouter({
        apiKey: process.env.AI_API_KEY,
        appName: "AnonyMsg"
    });

    let err: unknown = null;

    try {
        const result = streamText({
                model: openrouter('cohere/north-mini-code:free'),
                prompt,
                onError({ error }) {
                    err = error as Error;
                    console.error(`----Streaming Error: `, getErrorMessage(err), "----");
                },
                maxOutputTokens: 400,
                maxRetries: 0,
                timeout: {
                    totalMs: 30_000,
                    chunkMs: 5_000,
                },
                abortSignal: request.signal,
                providerOptions: {
                    openrouter: {
                        models: [
                            'poolside/laguna-xs-2.1:free',
                            'google/gemma-4-26b-a4b-it:free',
                            'inclusionai/ling-3.0-tiny:free',
                            // 'cohere/north-mini-code:free',
                            // "openai/gpt-oss-20b:free",
                            // 'google/gemma-4-31b-it:free',
                        ]
                    }
                }
        });

        return createTextStreamResponse({
            status: 200,
            stream: result.textStream,
        });
    }
    catch (error) {
        err = error;

        // Catches AI_RetryError, AI_APICallError, Rate Limit, or Upstream Errors
        if (AISDKError.isInstance(error)) {
            console.error(`Model failed with error:`, error);
        }
        else { // General error handling
            console.error('An unexpected error occurred:', error);
        }
    }

    return NextResponse.json({ success: false, message: getErrorMessage(err) }, { status: getStatusCode(err) });
}