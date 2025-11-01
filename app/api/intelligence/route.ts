import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
    try{
        const { prompt } = await req.json();
    
        const { text } = await generateText({
            model: openai("gpt-4.1-nano"),
            prompt,
        });
    
        return Response.json({ text });
    }
    catch (error) {
        console.error("Error generating text:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}