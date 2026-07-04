"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
	const supabase = createClient();

	async function handleLogin() {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${location.origin}/auth/callback`,
			},
		});
	}

	return (
		<main className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-6">
				<h1 className="text-2xl font-bold">ログイン</h1>
				<button
					type="button"
					onClick={handleLogin}
					className="rounded-lg bg-black px-6 py-3 text-white hover:bg-neutral-800"
				>
					Google でログイン
				</button>
			</div>
		</main>
	);
}
