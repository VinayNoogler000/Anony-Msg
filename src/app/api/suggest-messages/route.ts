import { streamText, createTextStreamResponse, AISDKError} from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { NextResponse } from 'next/server';
import { getErrorMessage, getStatusCode } from '@/helpers/error';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { requireEnv, requireEnvArray } from '@/helpers/getEnvVar';

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

    let err: unknown = null;

    try {
        const openrouter = createOpenRouter({
            apiKey: requireEnv("AI_API_KEY"),
            appName: "AnonyMsg"
        });

        const result = streamText({
            model: openrouter(requireEnv("PRIMARY_LLM")),
            prompt: requireEnv("PROMPT"),
            onError({ error }) {
                err = error as Error;
                console.error(`----Streaming Error: `, getErrorMessage(err), "----");
            },
            maxOutputTokens: 500,
            maxRetries: 0,
            timeout: {
                totalMs: 30_000,
                chunkMs: 5_000,
            },
            abortSignal: request.signal,
            providerOptions: {
                openrouter: {
                    models: requireEnvArray("FALLBACK_LLMs")
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