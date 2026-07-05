import Link from "next/link";
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

			{/* 4. 機能 */}
			<section
				style={{ maxWidth: 1120, margin: "0 auto", padding: "84px 24px" }}
			>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
						gap: 22,
					}}
				>
					{[
						{
							num: "01",
							tag: "時間",
							body: "次に読む本を選ぶのに毎回30分溶かす時間をなくす",
						},
						{
							num: "02",
							tag: "地位",
							body: "会議で経営理論の土台を語れるようになる",
						},
						{
							num: "03",
							tag: "苦痛除去",
							body: "レベルの合わない本を買って挫折するリスクを減らす",
						},
					].map(({ num, tag, body }) => (
						<div
							key={num}
							style={{
								border: "1px solid #E4E7EE",
								borderRadius: 14,
								padding: "30px 26px",
								background: "#FFFFFF",
							}}
						>
							<div
								style={{
									fontFamily: "Inter, sans-serif",
									fontSize: 12,
									fontWeight: 600,
									letterSpacing: "0.1em",
									color: "#1E3A8A",
									textTransform: "uppercase",
									marginBottom: 18,
								}}
							>
								{num}&nbsp;&nbsp;{tag}
							</div>
							<p
								style={{
									fontSize: 18,
									fontWeight: 700,
									lineHeight: 1.6,
									margin: 0,
								}}
							>
								{body}
							</p>
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
