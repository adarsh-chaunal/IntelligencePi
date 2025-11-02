import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
    try{
        const { prompt } = await request.json();

        const result = streamText({
            model: openai("gpt-4.1-nano"),
            prompt
        });

        return result.toUIMessageStreamResponse(); // converts the response to a form that UI can understand
    }
    catch (error) {
        console.error("Error streaming text:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}