import { Button } from "@/components/ui/button";
import { cn, reduceToThreeDigits } from "@/lib/utils";
import { useDrawEditor } from "@/providers/draw-editor-provider";
import { useLetMeGuess } from "@/providers/let-me-guess-provider";
import { Zap } from "lucide-react";

export function LlamaCharacter() {
	const { clear } = useDrawEditor();
	const {
		interpretation,
		lastSpeed,
		working,
		gameState,
		playAgain,
		targetWord,
	} = useLetMeGuess();
	return (
		<div
			className={cn(
				"fixed  left-[50%] ml-[-150px] border border-red-400 border-none transition-[top]",
				gameState === "won" ? "top-[65%]" : "top-[75%]",
			)}
		>
			<div
				className={cn(
					"border mt-2 bg-white border-border px-3 py-1 rounded-f ull flex gap-3 items-center justify-center",
				)}
			>
				{gameState === "playing" ? (
					<>
						{working
							? "Guessing..."
							: `${trimText(interpretation.replaceAll(".", ""))}?` ||
								"Come on! Clock is ticking ..."}
						{lastSpeed > 0 && (
							<>
								<Zap size={16} className="text-[#f55036]" />
								<div className="text-sm text-gray-500">
									{reduceToThreeDigits(lastSpeed)}ms
								</div>
							</>
						)}
					</>
				) : (
					`${targetWord}!`
				)}
			</div>
			<div
				className={cn(
					"w-[300px] h-[300px] bg-contain bg-center bg-no-repeat",
					gameState === "won"
						? "bg-[url(/llama/llama-happy.png)]"
						: "bg-[url(/llama/llama-normal.png)]",
				)}
			/>
			{gameState === "won" && (
				<div className="flex justify-center ">
					<Button
						className="text-xl px-10 py-6 rounded-full"
						onClick={() => {
							playAgain();
							clear();
						}}
					>
						Play again
					</Button>
				</div>
			)}
		</div>
	);
}

function trimText(text: string, maxWords = 5) {
	const words = text.split(" ");
	if (words.length <= maxWords) return text;

	return `${words.slice(0, maxWords).join(" ")}...`;
}
