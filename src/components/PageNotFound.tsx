import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function PageNotFound() {
	return (
		<div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
			<div className="w-full max-w-md rounded-xl border border-border bg-card shadow-sm">
				<div className="p-6">
					<span className="inline-block mb-3 px-2.5 py-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full">
						404
					</span>
					<h1 className="text-2xl font-bold">Page not found</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						The page you’re looking for doesn’t exist or may have been moved.
					</p>
					<div className="mt-4 flex gap-3">
						<Button asChild>
							<Link to="/">Go back</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
