export function Pricing() {
	return (
		<section style={{ maxWidth: 1120, margin: "0 auto", padding: "84px 24px" }}>
			<div
				style={{
					maxWidth: 760,
					margin: "0 auto",
					textAlign: "center",
					border: "1px solid #E4E7EE",
					borderRadius: 18,
					padding: "56px 32px",
					background: "linear-gradient(180deg, #FBFCFE, #FFFFFF)",
				}}
			>
				<div
					style={{
						fontFamily: "Inter, sans-serif",
						fontSize: 12,
						fontWeight: 600,
						letterSpacing: "0.14em",
						textTransform: "uppercase",
						color: "#1E3A8A",
						marginBottom: 18,
					}}
				>
					Pricing
				</div>
				<p
					style={{
						fontSize: "clamp(20px, 3vw, 26px)",
						fontWeight: 700,
						lineHeight: 1.6,
						margin: 0,
						letterSpacing: "-0.01em",
					}}
				>
					完全無料。運営費はAmazon/楽天の紹介リンクでまかなっています
				</p>
			</div>
		</section>
	);
}
