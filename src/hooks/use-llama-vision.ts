import Groq from "groq-sdk";

export function useLlamaVision() {
	async function fetchGuess(words: number, image_url: string) {
		const response = await fetch("/api", {
			method: "POST",
			body: JSON.stringify({ words, image_url }),
		});

		return response.json();
	}

	return {
		fetchGuess,
	};
}
