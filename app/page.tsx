import Link from "next/link";
import { HeaderAuthButton } from "@/components/HeaderAuthButton";
import { ComparisonTable } from "@/components/lp/ComparisonTable";
import { DemoPreview } from "@/components/lp/DemoPreview";
import { FooterCta } from "@/components/lp/FooterCta";
import { Hero } from "@/components/lp/Hero";
import { Pricing } from "@/components/lp/Pricing";

export default function HomePage() {
	return (
		<div
			style={{
				fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
				color: "#1A2233",
				background: "#FFFFFF",
				lineHeight: 1.7,
				WebkitFontSmoothing: "antialiased",
			}}
		>
			{/* Header */}
			<header
				style={{
					position: "sticky",
					top: 0,
					zIndex: 50,
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
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16,
						flexWrap: "wrap",
					}}
				>
					<div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
						<span
							style={{
								fontWeight: 700,
								fontSize: 19,
								letterSpacing: "-0.01em",
							}}
						>
							reading‑tree
						</span>
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
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 20,
							flexWrap: "wrap",
						}}
					>
						<span style={{ fontSize: 12.5, color: "#5B6577" }}>
							完全無料。運営費はAmazon/楽天の紹介リンクでまかなっています
						</span>
						<Link
							href="/fields/business-administration"
							style={{
								textDecoration: "none",
								background: "#1E3A8A",
								color: "#FFFFFF",
								fontWeight: 700,
								fontSize: 14,
								padding: "10px 18px",
								borderRadius: 8,
								whiteSpace: "nowrap",
							}}
						>
							経営学のツリーを見る
						</Link>
						<HeaderAuthButton />
					</div>
				</div>
			</header>

			{/* 1. Hero */}
			<Hero />

			{/* 2. Demo */}
			<DemoPreview />

			{/* 3. 共感 */}
			<section
				style={{
					background: "#F6F7FA",
					borderTop: "1px solid #EDEFF4",
					borderBottom: "1px solid #EDEFF4",
				}}
			>
				<div style={{ maxWidth: 820, margin: "0 auto", padding: "76px 24px" }}>
					<p
						style={{
							fontSize: "clamp(20px, 3vw, 27px)",
							fontWeight: 500,
							lineHeight: 1.72,
							margin: 0,
							letterSpacing: "-0.01em",
						}}
					>
						「世界標準の経営理論を読め」と言われても、その前に何を読むべきかは誰も教えてくれない。会議で先輩が当たり前のように使うフレームワークの背景を、自分だけ知らない気がする。
					</p>
				</div>
			</section>

			{/* 4. ペルソナの声（吹き出し） */}
			<section
				style={{ maxWidth: 1120, margin: "0 auto", padding: "84px 24px" }}
			>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
						gap: 32,
					}}
				>
					{[
						{
							initial: "Y",
							persona: "コンサルタント 1年目・24歳",
							quote:
								"経営学の本を薦められるたびに、ポーターとドラッカーどっちから読むべきか毎回1時間以上悩む。3週間経っても結局まだ何も読めていない。",
						},
						{
							initial: "K",
							persona: "戦略コンサル 若手社員・26歳",
							quote:
								"会議で上司が当たり前に引用する理論を、いつもわかってるふりで聞き流している。ちゃんと土台を作りたいのに、何から始めればいいかすらわからない。",
						},
						{
							initial: "T",
							persona: "MBA受験を目指す社会人・28歳",
							quote:
								"意気込んで企業戦略論を買ったら難しすぎて3章で挫折。レベルに合わない本をAmazonで買い続けるのをそろそろやめたい。",
						},
					].map(({ initial, persona, quote }) => (
						<div key={initial}>
							{/* 吹き出しカード */}
							<div
								style={{
									background: "#FFFFFF",
									border: "1px solid #E4E7EE",
									borderRadius: 16,
									padding: "28px 26px",
									position: "relative",
								}}
							>
								{/* 装飾クォートマーク */}
								<span
									aria-hidden="true"
									style={{
										position: "absolute",
										top: 14,
										left: 18,
										fontSize: 56,
										lineHeight: 1,
										color: "rgba(30,58,138,0.07)",
										fontFamily: "Georgia, serif",
										userSelect: "none",
									}}
								>
									"
								</span>
								<p
									style={{
										fontSize: 15,
										lineHeight: 1.8,
										color: "#1A2233",
										margin: 0,
										position: "relative",
										paddingTop: 6,
									}}
								>
									「{quote}」
								</p>
							</div>
							{/* 吹き出しの尻尾 */}
							<div style={{ position: "relative", height: 12, marginLeft: 30 }}>
								<div
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: 0,
										height: 0,
										borderLeft: "11px solid transparent",
										borderRight: "11px solid transparent",
										borderTop: "11px solid #E4E7EE",
									}}
								/>
								<div
									style={{
										position: "absolute",
										top: 0,
										left: 1,
										width: 0,
										height: 0,
										borderLeft: "10px solid transparent",
										borderRight: "10px solid transparent",
										borderTop: "10px solid #FFFFFF",
									}}
								/>
							</div>
							{/* ペルソナ */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 10,
									marginTop: 6,
									paddingLeft: 4,
								}}
							>
								<div
									style={{
										width: 36,
										height: 36,
										borderRadius: "50%",
										background: "rgba(30,58,138,0.10)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: 14,
										fontWeight: 700,
										color: "#1E3A8A",
										flexShrink: 0,
									}}
								>
									{initial}
								</div>
								<span style={{ fontSize: 13, color: "#5B6577" }}>
									{persona}
								</span>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* 5. 比較表 */}
			<ComparisonTable />

			{/* 6. Pricing */}
			<Pricing />

			{/* 7. Testimonial */}
			<section
				style={{
					background: "#F6F7FA",
					borderTop: "1px solid #EDEFF4",
					borderBottom: "1px solid #EDEFF4",
				}}
			>
				<div style={{ maxWidth: 1120, margin: "0 auto", padding: "76px 24px" }}>
					<h2
						style={{
							fontSize: "clamp(22px, 3vw, 30px)",
							fontWeight: 700,
							letterSpacing: "-0.01em",
							margin: "0 0 32px",
						}}
					>
						利用者の声
					</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
							gap: 20,
						}}
					>
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								style={{
									border: "1px dashed #C9CFDC",
									borderRadius: 14,
									padding: "40px 26px",
									background: "#FFFFFF",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									minHeight: 140,
								}}
							>
								<span style={{ color: "#A7AEBD", fontSize: 14 }}>準備中</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 8. Footer CTA + Footer */}
			<FooterCta />
		</div>
	);
}
