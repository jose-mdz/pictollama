import GroqLogo from "@/components/groq-logo";
import { Button } from "@/components/ui/button";
import { useLetMeGuess } from "@/providers/let-me-guess-provider";
import { RefreshCcw } from "lucide-react";

export function TopChrome() {
	const { targetWord, workingOnWord, refreshTargetWord, gameState } =
		useLetMeGuess();
	return (
		<div className="fixed flex flex-col items-center gap-1 z-10 top-0 left-0 w-full">
			<div className="w-[200px] h-[50px] bg-[url(/logo-pictollama.png)] bg-contain bg-no-repeat bg-center mt-2" />
			<div className="flex flex-col gap-1 items-center mt-[-10px]">
				<GroqLogo className="mt-4" height={15} />
			</div>
			{gameState === "playing" && (
				<div className="border mt-2 bg-white border-border px-3 py-1 rounded-full flex gap-3 items-center">
					{workingOnWord
						? "Let me think ..."
						: `Draw a: ${trimText(targetWord)}` ||
							"Coming up with something ..."}
					<Button
						size={"icon"}
						variant={"ghost"}
						className=" rounded-full"
						onClick={refreshTargetWord}
					>
						<RefreshCcw size={16} />
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
