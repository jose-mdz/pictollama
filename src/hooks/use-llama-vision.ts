import Groq from "groq-sdk";

export function useLlamaVision(apiKey: string) {
	const groq = new Groq({
		apiKey,
		dangerouslyAllowBrowser: true,
	});

	function callLlamaVision(prompt: string, image_url: string) {
		return groq.chat.completions.create({
			messages: [
				{
					role: "user",
					content: [
						{ type: "text", text: prompt },
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
	}

	return {
		callLlamaVision,
	};
}
