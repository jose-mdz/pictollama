import { useEffect, useState } from "react";
import { providerFactory } from "../lib/provider-factory";
import { useKeys } from "./keys-provider";
import { addBackground } from "@/lib/utils";
import { useLlamaVision } from "@/hooks/use-llama-vision";
import { useLlm } from "@/hooks/use-llm";
import confetti from "canvas-confetti";
import { drawingPrompts } from "@/lib/words";

const TIMER_GUESS_TICK = 2_000;
type GameState = "playing" | "won" | "lost";

const [LetMeGuessProvider, useLetMeGuess] = providerFactory(() => {
	const { keys } = useKeys();

	if (!keys) {
		throw new Error("No keys");
	}

	const [workingOnWord, setWorkingOnWord] = useState(false);
	const [targetWord, setTargetWord] = useState<string>("");
	const [currentImage, setCurrentImage] = useState<string | null>(null);
	const [working, setWorking] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [interpretation, setInterpretation] = useState<string>("");
	const [lastSpeed, setLastSpeed] = useState<number>(0);
	const [lastSubmit, setLastSubmit] = useState<number>(0);
	const { groqApiKey } = keys;
	const { callLlamaVision } = useLlamaVision(groqApiKey);
	const { callLlm } = useLlm(groqApiKey);
	const prompt = visionPrompt(targetWord);
	const [gameState, setGameState] = useState<GameState>("playing");

	async function submit() {
		if (!currentImage || working) {
			return;
		}

		setWorking(true);

		setMessages([...messages, { role: "user", content: prompt }]);
		const response = await callLlamaVision(
			prompt,
			await addBackground(currentImage),
		);

		const { role, content } = response.choices[0].message;

		setMessages((m) => [...m, { role, content }]);
		setWorking(false);

		const lastOne = response.choices[0].message.content;
		setInterpretation(lastOne || "");

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		setLastSpeed((response as any).usage?.total_time || 0);
		setLastSubmit(Date.now());
	}

	const refreshTargetWord = () => {
		if (workingOnWord) return;
		setTargetWord("");
	};

	const playAgain = () => {
		setGameState("playing");
		setTargetWord("");
		setInterpretation("");
		setCurrentImage(null);
		setMessages([]);
	};

	useEffect(() => {
		if (!currentImage) {
			setInterpretation("");
			setLastSpeed(0);
		}

		if (Date.now() - lastSubmit >= TIMER_GUESS_TICK) {
			submit();
		}
	}, [currentImage, submit, lastSubmit]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (targetWord || workingOnWord) {
			return;
		}

		// get a random entry
		const randomIndex = Math.floor(Math.random() * drawingPrompts.length);
		setTargetWord(drawingPrompts[randomIndex]);
	}, [targetWord]);

	useEffect(() => {
		if (hit(targetWord, interpretation)) {
			setGameState("won");
		}
	}, [interpretation, targetWord]);

	useEffect(() => {
		if (gameState === "won") {
			const randomInRange = (min: number, max: number) => {
				return Math.random() * (max - min) + min;
			};
			confetti({
				angle: randomInRange(55, 125),
				spread: randomInRange(50, 70),
				particleCount: randomInRange(50, 100),
				origin: { y: 0.6 },
			});
		}
	}, [gameState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Immediate submit if `currentImage` changed and didn't meet threshold
		const timeSinceLastSubmit = Date.now() - lastSubmit;
		if (currentImage && timeSinceLastSubmit < TIMER_GUESS_TICK) {
			// Use a delay to match the remaining time until the threshold is met
			const delay = TIMER_GUESS_TICK - timeSinceLastSubmit;
			const timer = setTimeout(submit, delay);

			return () => clearTimeout(timer); // Clear timeout if component unmounts or re-renders
		}
	}, [currentImage]);

	return {
		currentImage,
		interpretation,
		lastSpeed,
		messages,
		targetWord,
		setCurrentImage,
		setInterpretation,
		setMessages,
		refreshTargetWord,
		workingOnWord,
		working,
		gameState,
		playAgain,
	};
});

const visionPrompt = (target: string) => {
	const count = target.split(" ").length;
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

function hit(target: string, guess: string): boolean {
	if (!target || !guess) {
		return false;
	}
	// Helper function to sanitize the string by removing dots, commas, and spaces, and converting to lowercase
	const sanitize = (str: string): string => {
		return str.toLowerCase().replace(/[.,\s]/g, "");
	};

	const sanitizedTarget = sanitize(target);
	const sanitizedGuess = sanitize(guess);

	return sanitizedGuess.includes(sanitizedTarget);
}

export { LetMeGuessProvider, useLetMeGuess };
