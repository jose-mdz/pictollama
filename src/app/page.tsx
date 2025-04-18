"use client";
import { LetMeGuess } from "./components/let-me-guess";
import { EnterKey } from "./components/enter-key";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useKeys } from "@/providers/keys-provider";
import { LetMeGuessProvider } from "@/providers/let-me-guess-provider";
import { createGridTile } from "@/lib/utils";
import { useEffect, useState } from "react";

const GRID_TILE = createGridTile(10, 10);

export default function Home() {
	const [inited, setInited] = useState(false);

	useEffect(() => {
		if (inited) return;
		setInited(true);
	}, [inited]);

	if (!inited) {
		return (
			<main className="w-full h-svh flex items-center justify-center">
				Loading...
			</main>
		);
	}

	return (
		<main className="h-svh" style={{ backgroundImage: `url(${GRID_TILE})` }}>
			<LetMeGuessProvider>
				<LetMeGuess />
			</LetMeGuessProvider>
		</main>
	);
}
