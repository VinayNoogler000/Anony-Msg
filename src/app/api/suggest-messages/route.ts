import { streamText, createUIMessageStreamResponse, toUIMessageStream, APICallError } from 'ai';
import { google } from "@ai-sdk/google";

export async function GET(req: Request): Promise<Response> {
  try {
        const prompt =  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."; 

        const result = streamText({
            model: google("gemini-2.5-flash"),
            prompt,
            onError(error) {
                console.error("Error while streaming Text from AI-Model: ", error);
            },
            maxOutputTokens: 400,
        });
    
        return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream}),
        });
    } 
    catch (error) {
        if (error instanceof APICallError) {
            const { name, statusCode, responseHeaders, message } = error;
            return Response.json({
                name, statusCode, responseHeaders, message
            }, {status: statusCode})
        }
        else {
            console.error("An unexpected error occurred: ", error);
            throw error;
        }
    }
}