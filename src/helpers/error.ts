import { APICallError, NoSuchModelError, NoSuchProviderError, NoSuchProviderReferenceError, RetryError } from "ai";

export function getStatusCode(error?: unknown): number {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes('unauthorized') || message.includes('api key')) {
            console.error("Unathorize | API Key Invalid Error [api/suggest-messages/route.ts]")
            return 500;
        }
        if (message.includes('rate limit') || message.includes('too many requests')) {
            console.error("Rate Limit Error [api/suggest-messages/route.ts]");
            return 500;
        }

        if (message.includes('bad request')) {
            console.error("Bad Request Error [api/suggest-messages/route.ts]");
            return 400;
        }
    }

    if (APICallError.isInstance(error)) {
        console.error("AI-API Call Error [api/suggest-messages/route.ts]");
        return typeof error.statusCode === 'number' ? error.statusCode : 501;
    }

    if (RetryError.isInstance(error)) {
        console.error("AI-API Retry Operations Error [api/suggest-messages/route.ts]");
        return 501;
    }

    if (NoSuchProviderReferenceError.isInstance(error)) {
        console.error("AI-API Provider Reference Not Found Error [api/suggest-messages/route.ts]");
        return 501;
    }

    if (NoSuchProviderError.isInstance(error)) {
        console.error("AI-API Provider ID Not Found Error [api/suggest-messages/route.ts]");
        return 501;
    }

    if (NoSuchModelError.isInstance(error)) {
        console.error("AI-API Model ID Not Found Error [api/suggest-messages/route.ts]");
        return 501;
    }

    return 500;
}

export function getErrorMessage(error?: unknown): string {
    const message = error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
            ? error.message : "";

    if (message.includes("Not Authenticated")) {
        return "Not Authenticated. Please Login!";
    }

    if (message.includes("No output generated. Check the stream for errors")) {
        return "Unable to Suggest Messages due to AI Model's rate-limiting or high server-load. Please try again later!";
    }

    return message || "Something went wrong. Please try again later";
}