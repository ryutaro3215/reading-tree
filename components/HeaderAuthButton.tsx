"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function HeaderAuthButton() {
	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setLoggedIn(!!data.user);
		});
		const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
			setLoggedIn(!!session?.user);
		});
		return () => listener.subscription.unsubscribe();
	}, [supabase.auth]);

	async function handleLogout() {
		await supabase.auth.signOut();
		router.refresh();
	}

	if (loggedIn === null) return null;

	if (loggedIn) {
		return (
			<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
				<Link
					href="/mypage"
					style={{
						textDecoration: "none",
						fontSize: 14,
						fontWeight: 500,
						color: "#1A2233",
						padding: "8px 14px",
						borderRadius: 8,
						border: "1px solid #E4E7EE",
					}}
				>
					マイページ
				</Link>
				<button
					type="button"
					onClick={handleLogout}
					style={{
						cursor: "pointer",
						fontSize: 13,
						fontWeight: 500,
						color: "#5B6577",
						background: "none",
						border: "none",
						padding: "8px 0",
					}}
				>
					ログアウト
				</button>
			</div>
		);
	}

	return (
		<Link
			href="/login"
			style={{
				textDecoration: "none",
				fontSize: 14,
				fontWeight: 700,
				color: "#1E3A8A",
				padding: "8px 18px",
				borderRadius: 8,
				border: "1px solid #1E3A8A",
			}}
		>
			ログイン
		</Link>
	);
}
