// 静的プレビュー用の定数
const CX = 470;
const CY = 185;
const DEG = Math.PI / 180;

function pt(angleDeg: number, r: number) {
	return {
		x: Math.round(CX + r * Math.cos(angleDeg * DEG)),
		y: Math.round(CY + r * Math.sin(angleDeg * DEG)),
	};
}

function sectorPath(startDeg: number, endDeg: number, r: number) {
	const s = pt(startDeg, r);
	const e = pt(endDeg, r);
	const large = endDeg - startDeg > 180 ? 1 : 0;
	return `M ${CX} ${CY} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

// セクター定義（実装と同じ角度）
const SECTORS = [
	{
		label: "経営戦略・組織",
		startDeg: -148,
		endDeg: -32,
		centerDeg: -90,
		fill: "rgba(59,130,246,0.10)",
		labelColor: "#2563EB",
	},
	{
		label: "マーケティング",
		startDeg: -28,
		endDeg: 88,
		centerDeg: 30,
		fill: "rgba(16,185,129,0.10)",
		labelColor: "#059669",
	},
	{
		label: "財務・ファイナンス",
		startDeg: 92,
		endDeg: 208,
		centerDeg: 150,
		fill: "rgba(245,158,11,0.10)",
		labelColor: "#D97706",
	},
];

// サンプルノード
const NODES = [
	// 経営戦略・組織
	{
		angleDeg: -90,
		r: 50,
		level: "beginner",
		title: "経営学入門",
		delay: "0.2s",
	},
	{
		angleDeg: -120,
		r: 95,
		level: "intermediate",
		title: "経営戦略入門",
		delay: "0.35s",
	},
	{
		angleDeg: -60,
		r: 95,
		level: "intermediate",
		title: "組織論",
		delay: "0.4s",
	},
	{
		angleDeg: -115,
		r: 138,
		level: "advanced",
		title: "企業戦略論",
		delay: "0.55s",
	},
	{
		angleDeg: -65,
		r: 138,
		level: "advanced",
		title: "経営戦略の思考法",
		delay: "0.6s",
	},
	// マーケティング
	{
		angleDeg: 30,
		r: 50,
		level: "beginner",
		title: "マーケティング基本",
		delay: "0.25s",
	},
	{
		angleDeg: 30,
		r: 95,
		level: "intermediate",
		title: "コトラー",
		delay: "0.45s",
	},
	{
		angleDeg: 65,
		r: 138,
		level: "advanced",
		title: "確率思考の戦略論",
		delay: "0.65s",
	},
	// 財務・ファイナンス
	{ angleDeg: 150, r: 50, level: "beginner", title: "財務3表", delay: "0.3s" },
	{
		angleDeg: 150,
		r: 95,
		level: "intermediate",
		title: "CF戦略と実践",
		delay: "0.5s",
	},
	{
		angleDeg: 125,
		r: 138,
		level: "advanced",
		title: "企業価値評価",
		delay: "0.7s",
	},
] as const;

const NODE_STYLE = {
	beginner: { r: 8, fill: "#FFFFFF", stroke: "#1E3A8A", textColor: "#1A2233" },
	intermediate: {
		r: 12,
		fill: "rgba(30,58,138,0.14)",
		stroke: "#1E3A8A",
		textColor: "#1A2233",
	},
	advanced: { r: 16, fill: "#1E3A8A", stroke: "#1E3A8A", textColor: "#FFFFFF" },
};

export function DemoPreview() {
	return (
		<section
			id="demo"
			style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 24px 56px" }}
		>
			<div
				style={{
					border: "1px solid #E4E7EE",
					borderRadius: 18,
					background: "linear-gradient(180deg, #FBFCFE 0%, #FFFFFF 60%)",
					overflow: "hidden",
				}}
			>
				{/* Card header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "16px 22px",
						borderBottom: "1px solid #EDEFF4",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
						<span
							style={{
								width: 9,
								height: 9,
								borderRadius: "50%",
								background: "#1E3A8A",
								display: "inline-block",
							}}
						/>
						<span style={{ fontWeight: 700, fontSize: 15 }}>経営学ツリー</span>
						<span style={{ fontSize: 12, color: "#8A93A6" }}>
							3領域 × 3レベルの読書マップ
						</span>
					</div>
					<span
						style={{
							fontFamily: "Inter, sans-serif",
							fontSize: 11,
							letterSpacing: "0.08em",
							color: "#A7AEBD",
							textTransform: "uppercase",
						}}
					>
						Interactive preview
					</span>
				</div>

				{/* Radial graph preview */}
				<div style={{ padding: "24px 20px" }}>
					<div
						style={{
							position: "relative",
							width: "100%",
							maxWidth: 940,
							margin: "0 auto",
							aspectRatio: "940 / 370",
						}}
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 940 370"
							preserveAspectRatio="xMidYMid meet"
							style={{
								position: "absolute",
								inset: 0,
								width: "100%",
								height: "100%",
							}}
						>
							{/* Sector backgrounds */}
							{SECTORS.map((sec) => (
								<path
									key={sec.label}
									d={sectorPath(sec.startDeg, sec.endDeg, 155)}
									fill={sec.fill}
									stroke="none"
								/>
							))}

							{/* Sector divider lines */}
							{[-32, 88, 208].map((deg) => {
								const end = pt(deg, 155);
								return (
									<line
										key={deg}
										x1={CX}
										y1={CY}
										x2={end.x}
										y2={end.y}
										stroke="#E0E4EE"
										strokeWidth={1}
										strokeDasharray="3 3"
									/>
								);
							})}

							{/* Concentric ring guides */}
							{[50, 95, 138].map((r) => (
								<circle
									key={r}
									cx={CX}
									cy={CY}
									r={r}
									fill="none"
									stroke="#E4E7EE"
									strokeWidth={1}
									strokeDasharray="4 4"
								/>
							))}

							{/* Sector labels */}
							{SECTORS.map((sec) => {
								const pos = pt(sec.centerDeg, 163);
								return (
									<text
										key={sec.label}
										x={pos.x}
										y={pos.y}
										textAnchor="middle"
										dominantBaseline="middle"
										fill={sec.labelColor}
										fontSize={9}
										fontWeight={600}
										fontFamily="'Noto Sans JP', sans-serif"
										style={{ animation: "rt-rise 0.6s ease both 0.8s" }}
									>
										{sec.label}
									</text>
								);
							})}

							{/* Nodes */}
							{NODES.map(({ angleDeg, r, level, title, delay }) => {
								const pos = pt(angleDeg, r);
								const style = NODE_STYLE[level];
								return (
									<g
										key={title}
										style={{ animation: `rt-rise 0.5s ease both ${delay}` }}
									>
										<circle
											cx={pos.x}
											cy={pos.y}
											r={style.r}
											fill={style.fill}
											stroke={style.stroke}
											strokeWidth={1.2}
										/>
										<text
											x={pos.x}
											y={pos.y + style.r + 9}
											textAnchor="middle"
											fill="#1A2233"
											fontSize={8}
											fontFamily="'Noto Sans JP', sans-serif"
										>
											{title}
										</text>
									</g>
								);
							})}
						</svg>
					</div>
				</div>

				{/* Legend */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: 24,
						padding: "0 20px 20px",
					}}
				>
					{(
						[
							{
								label: "初級",
								size: 10,
								fill: "#FFFFFF",
								border: "1.5px solid #1E3A8A",
							},
							{
								label: "中級",
								size: 13,
								fill: "rgba(30,58,138,0.14)",
								border: "1.5px solid #1E3A8A",
							},
							{ label: "専門", size: 16, fill: "#1E3A8A", border: "none" },
						] as const
					).map(({ label, size, fill, border }) => (
						<div
							key={label}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 6,
								fontSize: 12,
								color: "#5B6577",
							}}
						>
							<span
								style={{
									width: size,
									height: size,
									borderRadius: "50%",
									background: fill,
									border,
									display: "inline-block",
									flexShrink: 0,
								}}
							/>
							{label}
						</div>
					))}
				</div>
			</div>

			<p
				style={{
					textAlign: "center",
					fontSize: 13,
					color: "#9AA2B2",
					margin: "14px 0 0",
				}}
			>
				ノードをクリックすると書籍詳細・購入リンクが表示されます
			</p>
		</section>
	);
}
