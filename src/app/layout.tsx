import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { KeysProvider } from "@/providers/keys-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Pictollama! Groq - Llama Vision",
	description: "Play drawing with an agent",
	openGraph: {
		images: "https://pictollama.geeksplainer.wtf/og-image.png",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={"overflow-hidden"}>
				<KeysProvider>{children}</KeysProvider>
			</body>
		</html>
	);
}
