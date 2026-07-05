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
							初級 → 中級 → 専門
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

				{/* Graph preview */}
				<div style={{ position: "relative", padding: "26px 20px" }}>
					{/* Legend */}
					<div
						style={{
							display: "flex",
							gap: 18,
							alignItems: "center",
							maxWidth: 940,
							margin: "0 auto 14px",
							fontSize: 12.5,
							color: "#5B6577",
						}}
					>
						{(
							[
								{
									label: "初級",
									size: 12,
									fill: "#FFFFFF",
									border: "1.5px solid #1E3A8A",
								},
								{
									label: "中級",
									size: 15,
									fill: "rgba(30,58,138,0.16)",
									border: "1.5px solid #1E3A8A",
								},
								{ label: "専門", size: 18, fill: "#1E3A8A", border: "none" },
							] as const
						).map(({ label, size, fill, border }) => (
							<div
								key={label}
								style={{ display: "flex", alignItems: "center", gap: 8 }}
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

					{/* Static tree */}
					<div
						style={{
							position: "relative",
							width: "100%",
							maxWidth: 940,
							margin: "0 auto",
							aspectRatio: "940 / 360",
						}}
					>
						{/* Edges */}
						<svg
							aria-hidden="true"
							viewBox="0 0 940 360"
							preserveAspectRatio="xMidYMid meet"
							style={{
								position: "absolute",
								inset: 0,
								width: "100%",
								height: "100%",
								pointerEvents: "none",
							}}
						>
							<g fill="none" stroke="#C4CBDA" strokeWidth={1.6}>
								{[
									{ d: "M150,180 C300,180 300,110 450,110", delay: "0.35s" },
									{ d: "M150,180 C295,180 295,270 440,270", delay: "0.45s" },
									{ d: "M450,110 C605,110 605,150 760,150", delay: "0.6s" },
									{ d: "M440,270 C600,270 600,150 760,150", delay: "0.68s" },
									{ d: "M450,110 C595,110 595,290 740,290", delay: "0.76s" },
								].map(({ d, delay }) => (
									<path
										key={d}
										d={d}
										pathLength={1}
										strokeDasharray={1}
										style={{ animation: `rt-draw 1s ease both ${delay}` }}
									/>
								))}
							</g>
						</svg>

						{/* Nodes */}
						{[
							{
								left: "16.0%",
								top: "50.0%",
								size: 56,
								fill: "#FFFFFF",
								border: "1.5px solid #1E3A8A",
								textColor: "#1A2233",
								label: "初級",
								title: "経営学入門",
								delay: "0.2s",
							},
							{
								left: "47.9%",
								top: "30.6%",
								size: 68,
								fill: "rgba(30,58,138,0.16)",
								border: "1.5px solid #1E3A8A",
								textColor: "#1A2233",
								label: "中級",
								title: "ゼミナール経営学入門",
								delay: "0.4s",
							},
							{
								left: "46.8%",
								top: "75.0%",
								size: 68,
								fill: "rgba(30,58,138,0.16)",
								border: "1.5px solid #1E3A8A",
								textColor: "#1A2233",
								label: "中級",
								title: "競争の戦略",
								delay: "0.48s",
							},
							{
								left: "80.9%",
								top: "41.7%",
								size: 84,
								fill: "#1E3A8A",
								border: "1.5px solid #1E3A8A",
								textColor: "#FFFFFF",
								label: "専門",
								title: "世界標準の経営理論",
								delay: "0.66s",
							},
							{
								left: "78.7%",
								top: "80.6%",
								size: 84,
								fill: "#1E3A8A",
								border: "1.5px solid #1E3A8A",
								textColor: "#FFFFFF",
								label: "専門",
								title: "組織の経済学",
								delay: "0.74s",
							},
						].map(
							({
								left,
								top,
								size,
								fill,
								border,
								textColor,
								label,
								title,
								delay,
							}) => (
								<div
									key={title}
									style={{
										position: "absolute",
										left,
										top,
										transform: "translate(-50%,-50%)",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 8,
										animation: `rt-rise 0.5s ease both ${delay}`,
									}}
								>
									<div
										style={{
											width: size,
											height: size,
											borderRadius: "50%",
											background: fill,
											border,
											color: textColor,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: size < 70 ? 11 : 12,
											fontWeight: 700,
											boxShadow:
												fill === "#1E3A8A"
													? "0 8px 22px rgba(30,58,138,0.22)"
													: "0 4px 12px rgba(26,34,51,0.08)",
										}}
									>
										{label}
									</div>
									<div
										style={{
											fontSize: 12.5,
											fontWeight: 500,
											background: "rgba(255,255,255,0.82)",
											padding: "1px 6px",
											borderRadius: 5,
											whiteSpace: "nowrap",
											color: "#1A2233",
										}}
									>
										{title}
									</div>
								</div>
							),
						)}
					</div>
				</div>
			</div>
			<p
				style={{
					textAlign: "center",
					fontSize: 13,
					color: "#9AA2B2",
					margin: "16px 0 0",
				}}
			>
				※
				ノードとエッジで読む順番と依存関係を可視化。実データを順次接続していきます。
			</p>
		</section>
	);
}
