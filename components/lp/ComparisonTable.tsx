export function ComparisonTable() {
	const rows: {
		label: string;
		ours: { mark: string; note?: string };
		blog: { mark: string; note?: string };
		notion: { mark: string; note?: string };
		nothing: { mark: string; note?: string };
	}[] = [
		{
			label: "読む順番の可視化",
			ours: { mark: "○", note: "ツリーで依存関係表示" },
			blog: { mark: "×", note: "羅列のみ" },
			notion: { mark: "△", note: "自分で作る手間" },
			nothing: { mark: "×" },
		},
		{
			label: "レベル別構成（初級→専門）",
			ours: { mark: "○" },
			blog: { mark: "×" },
			notion: { mark: "△" },
			nothing: { mark: "×" },
		},
		{
			label: "費用",
			ours: { mark: "無料" },
			blog: { mark: "無料" },
			notion: { mark: "無料", note: "構築の手間コスト大" },
			nothing: { mark: "０" },
		},
		{
			label: "更新・拡充",
			ours: { mark: "○", note: "提案→承認で継続更新" },
			blog: { mark: "×", note: "公開後は放置されがち" },
			notion: { mark: "△", note: "自分次第" },
			nothing: { mark: "—" },
		},
	];

	const cellStyle = (mark: string) => ({
		color:
			mark === "○" || mark === "無料"
				? "#1E3A8A"
				: mark === "△"
					? "#5B6577"
					: "#8A93A6",
		fontWeight: mark === "○" || mark === "無料" ? 700 : 400,
	});

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
							minWidth: 600,
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
										fontWeight: 400,
									}}
								>
									おすすめ本10選ブログ
								</th>
								<th
									style={{
										textAlign: "left",
										padding: "16px 18px",
										fontSize: 13,
										fontWeight: 400,
									}}
								>
									Notion/Obsidianで自作
								</th>
								<th
									style={{
										textAlign: "left",
										padding: "16px 18px",
										fontSize: 13,
										fontWeight: 400,
									}}
								>
									何もしない
								</th>
							</tr>
						</thead>
						<tbody style={{ fontSize: 14 }}>
							{rows.map(({ label, ours, blog, notion, nothing }, i) => (
								<tr
									key={label}
									style={{
										borderTop: "1px solid #EDEFF4",
										background: i % 2 === 1 ? "#FBFCFE" : "#FFFFFF",
									}}
								>
									<td
										style={{
											padding: "15px 18px",
											fontWeight: 700,
											whiteSpace: "nowrap",
										}}
									>
										{label}
									</td>
									{(
										[
											{ key: "ours", cell: ours },
											{ key: "blog", cell: blog },
											{ key: "notion", cell: notion },
											{ key: "nothing", cell: nothing },
										] as const
									).map(({ key, cell }) => (
										<td key={key} style={{ padding: "15px 18px" }}>
											<span style={cellStyle(cell.mark)}>{cell.mark}</span>
											{cell.note && (
												<span
													style={{
														fontSize: 12,
														color: "#8A93A6",
														marginLeft: 4,
													}}
												>
													{cell.note}
												</span>
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
