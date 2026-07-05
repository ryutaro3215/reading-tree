const rows = [
	{
		emoji: "🗺️",
		label: "読む順番の可視化",
		ours: { badge: "good", text: "ツリーで依存関係を表示" },
		theirs: { badge: "bad", text: "羅列のみ" },
	},
	{
		emoji: "📊",
		label: "レベル別の体系構成",
		ours: { badge: "good", text: "初級 → 中級 → 専門" },
		theirs: { badge: "bad", text: "つまみ食いになりがち" },
	},
	{
		emoji: "🎓",
		label: "本の信頼性",
		ours: { badge: "good", text: "78冊 ＋ 大学シラバス由来" },
		theirs: { badge: "mid", text: "書き手次第" },
	},
	{
		emoji: "🔄",
		label: "継続的な更新",
		ours: { badge: "good", text: "提案 → 承認で随時追加" },
		theirs: { badge: "bad", text: "公開後は放置されがち" },
	},
] as const;

type Badge = "good" | "mid" | "bad";

const BADGE: Record<Badge, { bg: string; color: string; mark: string }> = {
	good: { bg: "#DCFCE7", color: "#15803D", mark: "✅" },
	mid: { bg: "#FEF9C3", color: "#B45309", mark: "⚠️" },
	bad: { bg: "#FFE4E6", color: "#BE123C", mark: "❌" },
};

function Cell({ badge, text }: { badge: Badge; text: string }) {
	const s = BADGE[badge];
	return (
		<div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
			<span
				style={{
					display: "inline-block",
					padding: "2px 10px",
					borderRadius: 20,
					background: s.bg,
					color: s.color,
					fontSize: 12,
					fontWeight: 700,
					whiteSpace: "nowrap",
					flexShrink: 0,
				}}
			>
				{s.mark}
			</span>
			<span style={{ fontSize: 13.5, color: "#3D465A", lineHeight: 1.5 }}>
				{text}
			</span>
		</div>
	);
}

export function ComparisonTable() {
	return (
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
						margin: "0 0 36px",
					}}
				>
					他の選択肢と比べる
				</h2>

				<div style={{ overflowX: "auto" }}>
					<table
						style={{
							width: "100%",
							minWidth: 520,
							borderCollapse: "separate",
							borderSpacing: 0,
						}}
					>
						<colgroup>
							<col style={{ width: "36%" }} />
							<col style={{ width: "32%" }} />
							<col style={{ width: "32%" }} />
						</colgroup>
						<thead>
							<tr>
								<th style={{ padding: "0 0 12px" }} />
								{/* reading-tree 列 */}
								<th
									style={{ padding: "0 8px 12px 0", verticalAlign: "bottom" }}
								>
									<div
										style={{
											background: "#1E3A8A",
											color: "#FFFFFF",
											borderRadius: "14px 14px 0 0",
											padding: "16px 20px 14px",
											textAlign: "left",
										}}
									>
										<div
											style={{
												fontSize: 11,
												fontWeight: 500,
												letterSpacing: "0.1em",
												opacity: 0.7,
												marginBottom: 4,
											}}
										>
											このサービス
										</div>
										<div style={{ fontSize: 18, fontWeight: 700 }}>
											📖 reading‑tree
										</div>
									</div>
								</th>
								{/* 競合列 */}
								<th style={{ padding: "0 0 12px", verticalAlign: "bottom" }}>
									<div
										style={{
											background: "#E9EBF0",
											color: "#5B6577",
											borderRadius: "14px 14px 0 0",
											padding: "16px 20px 14px",
											textAlign: "left",
										}}
									>
										<div
											style={{
												fontSize: 11,
												fontWeight: 500,
												letterSpacing: "0.1em",
												opacity: 0.7,
												marginBottom: 4,
											}}
										>
											代替手段
										</div>
										<div style={{ fontSize: 16, fontWeight: 700 }}>
											📝 おすすめ本ブログ
										</div>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{rows.map(({ emoji, label, ours, theirs }, i) => {
								const isLast = i === rows.length - 1;
								const cellBase: React.CSSProperties = {
									padding: "20px",
									background: "#FFFFFF",
									borderTop: "1px solid #EDEFF4",
									borderBottom: isLast ? "none" : "none",
									verticalAlign: "top",
								};
								return (
									<tr key={label}>
										{/* ラベル列 */}
										<td
											style={{
												...cellBase,
												paddingLeft: 4,
												borderRight: "1px solid #EDEFF4",
												borderBottom: isLast ? "none" : "1px solid #EDEFF4",
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: 10,
												}}
											>
												<span style={{ fontSize: 22 }}>{emoji}</span>
												<span
													style={{
														fontSize: 14,
														fontWeight: 700,
														color: "#1A2233",
													}}
												>
													{label}
												</span>
											</div>
										</td>
										{/* reading-tree 列 */}
										<td
											style={{
												...cellBase,
												background: i % 2 === 0 ? "#F0F4FF" : "#E8EEFF",
												borderRight: "1px solid #C7D2FE",
												borderBottom: isLast ? "none" : "1px solid #C7D2FE",
												marginRight: 8,
											}}
										>
											<Cell badge={ours.badge} text={ours.text} />
										</td>
										{/* 競合列 */}
										<td
											style={{
												...cellBase,
												borderBottom: isLast ? "none" : "1px solid #EDEFF4",
											}}
										>
											<Cell badge={theirs.badge} text={theirs.text} />
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
