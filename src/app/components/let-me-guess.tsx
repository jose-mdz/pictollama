"use client";
import { DrawCanvas } from "../components/draw-canvas";
import { DrawEditorProvider } from "@/providers/draw-editor-provider";
import { TopCommands } from "./top-commands";
import { PaletteBar } from "./palette-bar";
import { PenAndEraserBar } from "./pen-and-eraser-bar";
import { useLetMeGuess } from "@/providers/let-me-guess-provider";
import { TopChrome } from "./top-chrome";
import { LlamaCharacter } from "./llama-character";

export function LetMeGuess() {
	const { setCurrentImage, gameState } = useLetMeGuess();
	return (
		<>
			<DrawEditorProvider>
				<DrawCanvas onImageChange={setCurrentImage} />
				{gameState === "playing" && <TopCommands />}
				{gameState === "playing" && <PaletteBar />}
				{gameState === "playing" && <PenAndEraserBar />}
				<LlamaCharacter />
			</DrawEditorProvider>
			<TopChrome />
		</>
	);
}
