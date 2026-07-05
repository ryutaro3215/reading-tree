"use client";

import Link from "next/link";
import { capture } from "@/lib/posthog";

export function FooterCta() {
	return (
		<>
			<section
				style={{ maxWidth: 1120, margin: "0 auto", padding: "100px 24px" }}
			>
				<div style={{ textAlign: "center" }}>
					<h2
						style={{
							fontSize: "clamp(28px, 4.4vw, 44px)",
							fontWeight: 700,
							letterSpacing: "-0.02em",
							margin: "0 0 32px",
						}}
					>
						今日から、経営学の迷子をやめる
					</h2>
					<Link
						href="/fields/keieigaku"
						onClick={() => capture("cta_click_footer")}
						style={{
							display: "inline-block",
							textDecoration: "none",
							background: "#1E3A8A",
							color: "#FFFFFF",
							fontWeight: 700,
							fontSize: 17,
							padding: "17px 36px",
							borderRadius: 10,
							boxShadow: "0 10px 28px rgba(30,58,138,0.24)",
						}}
					>
						経営学のツリーを見る
					</Link>
				</div>
			</section>

			<footer style={{ borderTop: "1px solid #EDEFF4" }}>
				<div
					style={{
						maxWidth: 1120,
						margin: "0 auto",
						padding: "30px 24px",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 12,
						flexWrap: "wrap",
					}}
				>
					<span style={{ fontWeight: 700, fontSize: 15 }}>reading‑tree</span>
					<span style={{ fontSize: 12.5, color: "#8A93A6" }}>
						完全無料。運営費はAmazon/楽天の紹介リンクでまかなっています
					</span>
				</div>
			</footer>
		</>
	);
}
