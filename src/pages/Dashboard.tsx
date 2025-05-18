import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Lightbulb, Rocket } from "lucide-react";
import { Bot } from "lucide-react";

const HIREIQ_AI_URL = "https://hireiq-live11.vercel.app/";
const RESUME_CHECKER_URL = "https://jobviewapp.streamlit.app/";

const BUTTONS = [
	{
		label: "Mock Interview",
		onClick: () =>
			window.open(HIREIQ_AI_URL, "_blank", "noopener,noreferrer"),
	},
	{
		label: "Resume Checker",
		onClick: () =>
			window.open(RESUME_CHECKER_URL, "_blank", "noopener,noreferrer"),
	},
	{
		label: "Resource Finder",
		onClick: () =>
			window.open("https://jobviewsearchresource.streamlit.app/", "_blank", "noopener,noreferrer"),
	},
	{
		label: "Resume Builder",
		onClick: () => {},
	},
];

const Dashboard = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setIsLoaded(true);

		const timer = setTimeout(() => {
			setProgress(87);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen bg-charcoal">
			<TopNavBar />

			<main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="w-full max-w-4xl"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 place-items-center">
						{BUTTONS.map((btn) => (
							<motion.div
								key={btn.label}
								whileHover={{
									scale: 1.06,
									y: -6,
									boxShadow: "0 12px 48px 0 rgba(124, 58, 237, 0.25)",
								}}
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className="flex justify-center w-full"
							>
								<Button
									onClick={btn.onClick}
									className={`
										flex flex-col items-center justify-center
										h-56 w-72 md:w-80
										rounded-3xl
										border-4 border-lilac
										bg-lilac/90
										text-3xl font-extrabold text-charcoal
										shadow-[0_8px_32px_0_rgba(124,58,237,0.13)]
										hover:bg-lilac
										hover:border-white
										hover:shadow-[0_16px_64px_0_rgba(124,58,237,0.25)]
										transition-all duration-300
										backdrop-blur-lg
										relative
										overflow-hidden
									`}
									style={{
										letterSpacing: "0.04em",
									}}
								>
									<span
										className="drop-shadow-lg"
										style={{
											textShadow: "0 2px 16px #b9a6ff99, 0 1px 0 #fff",
										}}
									>
										{btn.label}
									</span>
									<span className="text-base font-medium opacity-70 mt-4 text-center max-w-xs">
										{btn.label === "Mock Interview"
											? "AI-powered interview practice"
											: btn.label === "Resume Checker"
											? "Instant resume feedback"
											: btn.label === "Resource Finder"
											? "Curated resources for your career"
											: btn.label === "Resume Builder"
											? "Create a standout resume"
											: ""}
									</span>
									<div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-white/30" />
									<div className="absolute -inset-2 bg-gradient-to-br from-white/10 via-lilac/10 to-white/5 rounded-3xl blur-2xl opacity-60 pointer-events-none" />
								</Button>
							</motion.div>
						))}
					</div>
				</motion.div>
			</main>
		</div>
	);
};

export default Dashboard;
