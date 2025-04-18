import { NextResponse, type NextRequest } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
	const { words, image_url } = await request.json();

	const response = await performCompletion(words, image_url);

	return NextResponse.json({ response });
}

async function performCompletion(words: number, image_url: string) {
	const groq = new Groq({
		apiKey: process.env.GROQ_API_KEY,
	});
	const response = await groq.chat.completions.create({
		messages: [
			{
				role: "user",
				content: [
					{ type: "text", text: visionPrompt(words) },
					{
						type: "image_url",
						image_url: { url: image_url },
						// biome-ignore lint/suspicious/noExplicitAny: SDK not updated
					} as any,
				],
			},
		],
		temperature: 0,
		model: "meta-llama/llama-4-scout-17b-16e-instruct",
		max_tokens: 300,
	});

	return response.choices[0].message.content;
}

const visionPrompt = (wordsCount: number) => {
	const count = wordsCount;
	const words = count === 1 ? "word" : "words";
	return `
The image is a drawing from a guessing game.
The answer should be exactly ${count} ${words}.
Describe the image in ${count} ${words}.
If the image is pointing somewhere, focus on that and describe that in ${count} ${words}.
If there is an indication of signaling a specific part of the image, think about what could it be and describe it in ${count} ${words}. 
Remember this is a guessing game and you should be trying to guess what the user is pointing at.
`;
};
