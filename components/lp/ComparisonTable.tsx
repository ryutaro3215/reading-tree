export function ComparisonTable() {
	const rows = [
		{
			label: "読む順番の可視化",
			ours: { mark: "○", note: "ツリーで依存関係表示" },
			theirs: { mark: "×", note: "羅列のみ" },
		},
		{
			label: "体系性",
			ours: { mark: "○", note: "初級→中級→専門のレベル構成" },
			theirs: { mark: "×", note: "つまみ食いになりがち" },
		},
		{
			label: "本の質",
			ours: { mark: "○", note: "経営学78冊＋大学シラバス由来" },
			theirs: { mark: "△", note: "書き手次第" },
		},
		{
			label: "更新・拡充",
			ours: { mark: "○", note: "提案→承認で継続更新" },
			theirs: { mark: "×", note: "公開後は放置されがち" },
		},
	];

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
				<div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
					<table
						style={{
							width: "100%",
							minWidth: 480,
							borderCollapse: "collapse",
							background: "#FFFFFF",
							border: "1px solid #E4E7EE",
							borderRadius: 12,
							overflow: "hidden",
						}}
					>
						<thead>
							<tr style={{ background: "#1A2233", color: "#FFFFFF" }}>
								<th
									style={{
										textAlign: "left",
										padding: "16px 18px",
										fontSize: 13,
										fontWeight: 500,
									}}
								/>
								<th
									style={{
										textAlign: "left",
										padding: "16px 18px",
										fontSize: 14,
										fontWeight: 700,
									}}
								>
									reading‑tree
								</th>
								<th
									style={{
										textAlign: "left",
										padding: "16px 18px",
										fontSize: 13,
										fontWeight: 500,
									}}
								>
									おすすめ本10選ブログ
								</th>
							</tr>
						</thead>
						<tbody style={{ fontSize: 14 }}>
							{rows.map(({ label, ours, theirs }, i) => (
								<tr
									key={label}
									style={{
										borderTop: "1px solid #EDEFF4",
										background: i % 2 === 1 ? "#FBFCFE" : "#FFFFFF",
									}}
								>
									<td style={{ padding: "15px 18px", fontWeight: 700 }}>
										{label}
									</td>
									<td style={{ padding: "15px 18px" }}>
										<span style={{ color: "#1E3A8A", fontWeight: 700 }}>
											{ours.mark}
										</span>{" "}
										<span style={{ color: "#5B6577", fontSize: 12.5 }}>
											{ours.note}
										</span>
									</td>
									<td style={{ padding: "15px 18px" }}>
										<span style={{ color: "#8A93A6" }}>{theirs.mark}</span>{" "}
										<span style={{ fontSize: 12.5, color: "#8A93A6" }}>
											{theirs.note}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
