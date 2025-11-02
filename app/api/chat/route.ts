import { UIMessage, streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";


export async function POST(req: Request) {
    try {
        const { messages } : { messages: UIMessage[] } = await req.json();
        
        const result = streamText({
            model: openai("gpt-4.1-nano"),
            messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
    }
    catch (error) {
        console.error("Error during streaming:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}