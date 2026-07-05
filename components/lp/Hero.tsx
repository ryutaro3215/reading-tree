"use client";

import { capture } from "@/lib/posthog";

export function Hero() {
	return (
		<section
			style={{
				maxWidth: 1120,
				margin: "0 auto",
				padding: "88px 24px 40px",
			}}
		>
			<div style={{ maxWidth: 820 }}>
				<div
					style={{
						fontFamily: "Inter, sans-serif",
						fontSize: 12,
						fontWeight: 600,
						letterSpacing: "0.14em",
						textTransform: "uppercase",
						color: "#1E3A8A",
						marginBottom: 22,
						animation: "rt-rise 0.6s ease both",
					}}
				>
					Reading Roadmap for Management
				</div>
				<h1
					style={{
						fontSize: "clamp(32px, 5.2vw, 54px)",
						fontWeight: 700,
						lineHeight: 1.28,
						letterSpacing: "-0.02em",
						margin: "0 0 24px",
						animation: "rt-rise 0.7s ease both 0.05s",
					}}
				>
					コンサル1年目の経営学、遠回りゼロで読む順番がわかる
				</h1>
				<p
					style={{
						fontSize: "clamp(16px, 2vw, 19px)",
						color: "#3D465A",
						margin: "0 0 36px",
						maxWidth: 680,
						lineHeight: 1.7,
						animation: "rt-rise 0.7s ease both 0.12s",
					}}
				>
					フレームワークは知っていても、その土台がない人へ。経営学78冊と主要大学MBAのシラバスから、初級→中級→専門の順に読むツリーを無料で公開しています。
				</p>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 20,
						flexWrap: "wrap",
						animation: "rt-rise 0.7s ease both 0.18s",
					}}
				>
					<a
						href="/fields/keieigaku"
						onClick={() => capture("cta_click_hero")}
						style={{
							textDecoration: "none",
							background: "#1E3A8A",
							color: "#FFFFFF",
							fontWeight: 700,
							fontSize: 16,
							padding: "15px 30px",
							borderRadius: 10,
							boxShadow: "0 8px 24px rgba(30,58,138,0.22)",
							display: "inline-block",
						}}
					>
						経営学のツリーを見る
					</a>
					<span style={{ fontSize: 13.5, color: "#5B6577" }}>
						完全無料。運営費はAmazon/楽天の紹介リンクでまかなっています
					</span>
				</div>
			</div>
		</section>
	);
}
