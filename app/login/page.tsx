"use client";

import Link from "next/link";
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
		<div
			style={{
				fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
				color: "#1A2233",
				background: "#F6F7FA",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Header */}
			<header
				style={{
					background: "rgba(255,255,255,0.88)",
					backdropFilter: "blur(10px)",
					borderBottom: "1px solid #EBEDF2",
				}}
			>
				<div
					style={{
						maxWidth: 1120,
						margin: "0 auto",
						padding: "16px 24px",
						display: "flex",
						alignItems: "baseline",
						gap: 10,
					}}
				>
					<Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
						<span
							style={{
								fontWeight: 700,
								fontSize: 19,
								letterSpacing: "-0.01em",
							}}
						>
							reading‑tree
						</span>
					</Link>
					<span
						style={{
							fontFamily: "Inter, sans-serif",
							fontSize: 11,
							fontWeight: 500,
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							color: "#8A93A6",
						}}
					>
						書籍ロードマップ
					</span>
				</div>
			</header>

			{/* Main */}
			<main
				style={{
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "40px 24px",
				}}
			>
				<div
					style={{
						background: "#FFFFFF",
						border: "1px solid #E4E7EE",
						borderRadius: 20,
						padding: "48px 40px",
						width: "100%",
						maxWidth: 420,
						textAlign: "center",
					}}
				>
					{/* Logo mark */}
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: 56,
							height: 56,
							borderRadius: "50%",
							background: "rgba(30,58,138,0.08)",
							marginBottom: 24,
						}}
					>
						<span style={{ fontSize: 26 }}>📚</span>
					</div>

					<h1
						style={{
							fontSize: 22,
							fontWeight: 700,
							margin: "0 0 8px",
							letterSpacing: "-0.01em",
						}}
					>
						ログイン
					</h1>
					<p
						style={{
							fontSize: 14,
							color: "#5B6577",
							margin: "0 0 32px",
							lineHeight: 1.6,
						}}
					>
						書籍を保存するにはログインが必要です
					</p>

					<button
						type="button"
						onClick={handleLogin}
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 12,
							padding: "13px 20px",
							borderRadius: 10,
							border: "1px solid #E4E7EE",
							background: "#FFFFFF",
							cursor: "pointer",
							fontSize: 15,
							fontWeight: 600,
							color: "#1A2233",
							fontFamily: "inherit",
							boxShadow: "0 2px 8px rgba(26,34,51,0.06)",
							transition: "box-shadow 0.2s, border-color 0.2s",
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLButtonElement).style.borderColor =
								"#1E3A8A";
							(e.currentTarget as HTMLButtonElement).style.boxShadow =
								"0 4px 14px rgba(26,34,51,0.10)";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLButtonElement).style.borderColor =
								"#E4E7EE";
							(e.currentTarget as HTMLButtonElement).style.boxShadow =
								"0 2px 8px rgba(26,34,51,0.06)";
						}}
					>
						{/* Google SVG icon */}
						<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
							<path
								fill="#4285F4"
								d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z"
							/>
							<path
								fill="#34A853"
								d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.6-17.7 11.7z"
							/>
							<path
								fill="#FBBC05"
								d="M24 45c5.5 0 10.6-1.9 14.5-5.1l-6.7-5.5C29.8 36 27 37 24 37c-5.7 0-10.6-3.1-11.8-7.5l-7 5.4C8.1 40.5 15.5 45 24 45z"
							/>
							<path
								fill="#EA4335"
								d="M44.5 20H24v8.5h11.8c-1.1 3-3.5 5.5-6.8 6.9l6.7 5.5C40.1 37.6 44.5 31.3 44.5 24c0-1.3-.2-2.7-.5-4z"
							/>
						</svg>
						Google でログイン
					</button>

					<p
						style={{
							fontSize: 12,
							color: "#9AA2B2",
							margin: "24px 0 0",
							lineHeight: 1.6,
						}}
					>
						ログインすることで、書籍の保存機能が使えます。
						<br />
						アカウント情報は安全に管理されます。
					</p>
				</div>
			</main>
		</div>
	);
}
