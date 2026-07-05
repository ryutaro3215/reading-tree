"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { capture } from "@/lib/posthog";

type Level = "beginner" | "intermediate" | "advanced";
type Category = "strategy" | "marketing" | "finance";

type RawBook = {
	id: string;
	title: string;
	author: string | null;
	isbn: string | null;
	level: Level;
};

type BookNode = RawBook & { x: number; y: number; category: Category };

type RawEdge = { fromId: string; toId: string };

type Props = {
	fieldName: string;
	fieldSlug: string;
	rawBooks: RawBook[];
	rawEdges: RawEdge[];
};

// ─── Canvas & layout ───────────────────────────────────────────────────────
const CANVAS_SIZE = 1300;
const CX = 650;
const CY = 650;
const DEG = Math.PI / 180;

const RADII: Record<Level, number> = {
	beginner: 190,
	intermediate: 385,
	advanced: 560,
};

// ─── Sectors (3 × 120°, with 4° gap between each) ────────────────────────
const SECTOR_ARC_DEG = 116; // usable arc per sector
const SECTORS: {
	id: Category;
	label: string;
	centerDeg: number;
	startDeg: number;
	endDeg: number;
	fill: string;
	hoverFill: string;
	labelColor: string;
}[] = [
	{
		id: "strategy",
		label: "経営戦略・組織",
		centerDeg: -90,
		startDeg: -148,
		endDeg: -32,
		fill: "rgba(59,130,246,0.10)",
		hoverFill: "rgba(59,130,246,0.20)",
		labelColor: "#2563EB",
	},
	{
		id: "marketing",
		label: "マーケティング",
		centerDeg: 30,
		startDeg: -28,
		endDeg: 88,
		fill: "rgba(16,185,129,0.10)",
		hoverFill: "rgba(16,185,129,0.20)",
		labelColor: "#059669",
	},
	{
		id: "finance",
		label: "財務・ファイナンス",
		centerDeg: 150,
		startDeg: 92,
		endDeg: 208,
		fill: "rgba(245,158,11,0.10)",
		hoverFill: "rgba(245,158,11,0.20)",
		labelColor: "#D97706",
	},
];

const SECTOR_LABEL_R = 630;

// ─── Book → category mapping (by title) ───────────────────────────────────
const CATEGORY_MAP: Record<string, Category> = {
	// 経営戦略・組織
	経営学入門: "strategy",
	経営学とはなにか: "strategy",
	ゼミナール経営学入門: "strategy",
	領域を超える経営学: "strategy",
	世界は経営でできている: "strategy",
	"逆・タイムマシン経営論": "strategy",
	世界標準の経営理論: "strategy",
	経営戦略入門: "strategy",
	"経営戦略の論理 (第4版)": "strategy",
	競争戦略論I: "strategy",
	ストーリーとしての競争戦略: "strategy",
	"組織論 (補訂版)": "strategy",
	"組織行動のマネジメント (新版)": "strategy",
	"知識創造企業 (新装版)": "strategy",
	失敗の本質: "strategy",
	両利きの経営: "strategy",
	企業戦略論: "strategy",
	"企業戦略論[上]基本編:競争優位の構築と持続": "strategy",
	"企業戦略論[中]事業戦略編:競争優位の構築と持続": "strategy",
	"企業戦略論[下]全社戦略編:競争優位の構築と持続": "strategy",
	経営戦略の思考法: "strategy",
	組織の不条理: "strategy",
	// マーケティング
	"コトラー&ケラーのマーケティング・マネジメント 基本編": "marketing",
	アントレプレナーシップ: "marketing",
	"イノベーションのジレンマ (増補改訂版)": "marketing",
	知識創造の方法論: "marketing",
	// 財務・ファイナンス
	"経営管理 (新版)": "finance",
	"[新版] MBA経営戦略": "finance",
	"リサーチ・デザイン": "finance",
	企業評価の組織論的研究: "finance",
	経営の知的思考: "finance",
};

// ─── Visual styles ─────────────────────────────────────────────────────────
const LEVEL_STYLE: Record<
	Level,
	{
		r: number;
		fill: string;
		border: string;
		textColor: string;
		label: string;
		badgeBg: string;
		badgeColor: string;
	}
> = {
	beginner: {
		r: 28,
		fill: "#FFFFFF",
		border: "1.5px solid #1E3A8A",
		textColor: "#1A2233",
		label: "初級",
		badgeBg: "rgba(30,58,138,0.10)",
		badgeColor: "#1E3A8A",
	},
	intermediate: {
		r: 36,
		fill: "rgba(30,58,138,0.14)",
		border: "1.5px solid #1E3A8A",
		textColor: "#1A2233",
		label: "中級",
		badgeBg: "rgba(30,58,138,0.16)",
		badgeColor: "#1E3A8A",
	},
	advanced: {
		r: 46,
		fill: "#1E3A8A",
		border: "1.5px solid #1E3A8A",
		textColor: "#FFFFFF",
		label: "専門",
		badgeBg: "#1E3A8A",
		badgeColor: "#FFFFFF",
	},
};

// ─── SVG helpers ───────────────────────────────────────────────────────────
function polarPath(startDeg: number, endDeg: number, r: number): string {
	const s = startDeg * DEG;
	const e = endDeg * DEG;
	const x1 = Math.round(CX + r * Math.cos(s));
	const y1 = Math.round(CY + r * Math.sin(s));
	const x2 = Math.round(CX + r * Math.cos(e));
	const y2 = Math.round(CY + r * Math.sin(e));
	const large = endDeg - startDeg > 180 ? 1 : 0;
	return `M ${CX} ${CY} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

// ─── Layout ────────────────────────────────────────────────────────────────
const clamp = (s: number) => Math.max(0.4, Math.min(4, s));

function layoutBooks(rawBooks: RawBook[]): BookNode[] {
	const books: BookNode[] = [];
	for (const sector of SECTORS) {
		for (const level of ["beginner", "intermediate", "advanced"] as Level[]) {
			const items = rawBooks.filter(
				(b) =>
					b.level === level &&
					(CATEGORY_MAP[b.title] ?? "strategy") === sector.id,
			);
			const r = RADII[level];
			const halfArc = (SECTOR_ARC_DEG / 2) * DEG;
			items.forEach((b, i) => {
				const angle =
					items.length === 1
						? sector.centerDeg * DEG
						: sector.centerDeg * DEG -
							halfArc +
							((SECTOR_ARC_DEG * DEG) / (items.length - 1)) * i;
				books.push({
					...b,
					category: CATEGORY_MAP[b.title] ?? "strategy",
					x: Math.round(CX + r * Math.cos(angle)),
					y: Math.round(CY + r * Math.sin(angle)),
				});
			});
		}
	}
	return books;
}

function amazonUrl(book: { title: string; isbn: string | null }): string {
	if (book.isbn) return `https://www.amazon.co.jp/dp/${book.isbn}`;
	return `https://www.amazon.co.jp/s?k=${encodeURIComponent(book.title)}`;
}

// ─── Component ─────────────────────────────────────────────────────────────
export function BookGraph({ fieldName, fieldSlug, rawBooks }: Props) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [hoveredSector, setHoveredSector] = useState<Category | null>(null);
	const [view, setView] = useState({ s: 1, tx: 0, ty: 0 });
	const [dragging, setDragging] = useState(false);
	const stageRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{
		x: number;
		y: number;
		tx: number;
		ty: number;
	} | null>(null);

	const books = layoutBooks(rawBooks);
	const bookById = Object.fromEntries(books.map((b) => [b.id, b]));
	const activeSector = dragging ? null : hoveredSector;

	const fitView = useCallback(() => {
		const el = stageRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const s = clamp(
			Math.min(r.width / CANVAS_SIZE, r.height / CANVAS_SIZE) * 0.92,
		);
		setView({
			s,
			tx: (r.width - CANVAS_SIZE * s) / 2,
			ty: (r.height - CANVAS_SIZE * s) / 2,
		});
	}, []);

	useEffect(() => {
		requestAnimationFrame(fitView);
		window.addEventListener("resize", fitView);
		return () => window.removeEventListener("resize", fitView);
	}, [fitView]);

	const applyZoom = (factor: number, cx: number, cy: number) =>
		setView((v) => {
			const ns = clamp(v.s * factor);
			const k = ns / v.s;
			return { s: ns, tx: cx - (cx - v.tx) * k, ty: cy - (cy - v.ty) * k };
		});

	const onWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const rect = e.currentTarget.getBoundingClientRect();
		applyZoom(
			e.deltaY < 0 ? 1.12 : 1 / 1.12,
			e.clientX - rect.left,
			e.clientY - rect.top,
		);
	};

	const onPanStart = (e: React.PointerEvent) => {
		dragRef.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
		setDragging(true);
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onPanMove = (e: React.PointerEvent) => {
		const drag = dragRef.current;
		if (!drag) return;
		setView((v) => ({
			...v,
			tx: drag.tx + e.clientX - drag.x,
			ty: drag.ty + e.clientY - drag.y,
		}));
	};

	const onPanEnd = () => {
		dragRef.current = null;
		setDragging(false);
	};

	const zoomButton = (factor: number) => {
		const el = stageRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		applyZoom(factor, r.width / 2, r.height / 2);
	};

	const selected = selectedId ? bookById[selectedId] : null;

	return (
		<div
			style={{
				fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
				color: "#1A2233",
				background: "#FFFFFF",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Header */}
			<header style={{ borderBottom: "1px solid #EBEDF2", flexShrink: 0 }}>
				<div
					style={{
						maxWidth: 1240,
						margin: "0 auto",
						padding: "18px 24px",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16,
						flexWrap: "wrap",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "baseline",
							gap: 16,
							flexWrap: "wrap",
						}}
					>
						<a
							href="/"
							style={{
								textDecoration: "none",
								color: "#8A93A6",
								fontSize: 13,
								display: "inline-flex",
								alignItems: "center",
								gap: 5,
							}}
						>
							<span style={{ fontSize: 15 }}>←</span> トップへ戻る
						</a>
						<div style={{ width: 1, height: 20, background: "#E4E7EE" }} />
						<div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
							<h1
								style={{
									fontSize: 22,
									fontWeight: 700,
									margin: 0,
									letterSpacing: "-0.01em",
								}}
							>
								{fieldName}
							</h1>
							<span style={{ fontSize: 13, color: "#5B6577" }}>
								初級→中級→専門の順に、依存関係で読む順番を可視化
							</span>
						</div>
					</div>
					<a
						href={`/fields/${fieldSlug}/propose`}
						style={{
							cursor: "pointer",
							background: "#1E3A8A",
							color: "#FFFFFF",
							fontFamily: "inherit",
							fontWeight: 700,
							fontSize: 14,
							padding: "11px 20px",
							borderRadius: 9,
							boxShadow: "0 6px 18px rgba(30,58,138,0.2)",
							textDecoration: "none",
							display: "inline-block",
						}}
					>
						本を追加提案する
					</a>
				</div>
			</header>

			{/* Main */}
			<div style={{ flex: 1, display: "flex", minHeight: 0, flexWrap: "wrap" }}>
				{/* Graph stage */}
				<div
					ref={stageRef}
					onWheel={onWheel}
					onPointerDown={onPanStart}
					onPointerMove={onPanMove}
					onPointerUp={onPanEnd}
					onPointerLeave={onPanEnd}
					style={{
						flex: "1 1 560px",
						minWidth: 300,
						minHeight: 600,
						position: "relative",
						background:
							"radial-gradient(circle at 50% 50%, #FBFCFE 0%, #F5F7FB 100%)",
						overflow: "hidden",
						touchAction: "none",
						cursor: dragging ? "grabbing" : "grab",
					}}
				>
					{/* Legend */}
					<div
						style={{
							position: "absolute",
							top: 18,
							left: 18,
							zIndex: 5,
							background: "rgba(255,255,255,0.92)",
							border: "1px solid #E7EAF1",
							borderRadius: 10,
							padding: "12px 14px",
							display: "flex",
							flexDirection: "column",
							gap: 9,
						}}
					>
						<div
							style={{
								fontFamily: "Inter, sans-serif",
								fontSize: 10,
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								color: "#9AA2B2",
							}}
						>
							Level
						</div>
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
									fill: "rgba(30,58,138,0.14)",
									border: "1.5px solid #1E3A8A",
								},
								{ label: "専門", size: 18, fill: "#1E3A8A", border: "none" },
							] as const
						).map(({ label, size, fill, border }) => (
							<div
								key={label}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 9,
									fontSize: 12.5,
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

					{/* World */}
					<div
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							width: CANVAS_SIZE,
							height: CANVAS_SIZE,
							transformOrigin: "0 0",
							transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.s})`,
							willChange: "transform",
						}}
					>
						{/* SVG: sector backgrounds + guides + labels */}
						<svg
							role="img"
							aria-label="経営学の領域マップ"
							viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
							style={{
								position: "absolute",
								inset: 0,
								width: "100%",
								height: "100%",
							}}
						>
							{/* Sector hover areas + fills (mouse-only decoration) */}
							{SECTORS.map((sec) => (
								// biome-ignore lint/a11y/noStaticElementInteractions: SVG sector used as mouse hover zone only
								<path
									key={sec.id}
									d={polarPath(sec.startDeg, sec.endDeg, RADII.advanced + 90)}
									fill={activeSector === sec.id ? sec.hoverFill : sec.fill}
									stroke="none"
									style={{ cursor: "default", transition: "fill 0.35s ease" }}
									onMouseEnter={() => setHoveredSector(sec.id)}
									onMouseLeave={() => setHoveredSector(null)}
								/>
							))}

							{/* Sector divider lines */}
							{[-32, 88, 208].map((deg) => {
								const r = RADII.advanced + 90;
								const x = Math.round(CX + r * Math.cos(deg * DEG));
								const y = Math.round(CY + r * Math.sin(deg * DEG));
								return (
									<line
										key={deg}
										x1={CX}
										y1={CY}
										x2={x}
										y2={y}
										stroke="#E0E4EE"
										strokeWidth={1}
										strokeDasharray="4 4"
										style={{ pointerEvents: "none" }}
									/>
								);
							})}

							{/* Concentric ring guides */}
							{(Object.values(RADII) as number[]).map((r) => (
								<circle
									key={r}
									cx={CX}
									cy={CY}
									r={r}
									fill="none"
									stroke="#E4E7EE"
									strokeWidth={1}
									strokeDasharray="5 5"
									style={{ pointerEvents: "none" }}
								/>
							))}

							{/* Sector labels */}
							{SECTORS.map((sec) => {
								const angle = sec.centerDeg * DEG;
								const lx = Math.round(CX + SECTOR_LABEL_R * Math.cos(angle));
								const ly = Math.round(CY + SECTOR_LABEL_R * Math.sin(angle));
								return (
									<text
										key={sec.id}
										x={lx}
										y={ly}
										textAnchor="middle"
										dominantBaseline="middle"
										fill={activeSector === sec.id ? sec.labelColor : "#9AA2B2"}
										fontSize={13}
										fontWeight={activeSector === sec.id ? 700 : 500}
										fontFamily="'Noto Sans JP', sans-serif"
										style={{
											pointerEvents: "none",
											transition: "fill 0.35s ease, font-weight 0.35s ease",
										}}
									>
										{sec.label}
									</text>
								);
							})}
						</svg>

						{/* Nodes */}
						{books.map((b) => {
							const ls = LEVEL_STYLE[b.level];
							const sel = b.id === selectedId;
							const inActive =
								activeSector === null || b.category === activeSector;
							return (
								<button
									key={b.id}
									type="button"
									aria-label={`${b.title} (${ls.label})`}
									aria-pressed={sel}
									onClick={() => {
										setSelectedId(b.id);
										capture("tree_node_click", {
											book_id: b.id,
											book_title: b.title,
											level: b.level,
										});
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											setSelectedId(b.id);
											capture("tree_node_click", {
												book_id: b.id,
												book_title: b.title,
												level: b.level,
											});
										}
									}}
									style={{
										position: "absolute",
										left: b.x,
										top: b.y,
										transform: `translate(-50%, -50%)${inActive && activeSector ? " translateY(-8px) scale(1.08)" : ""}`,
										opacity: inActive ? 1 : 0.25,
										transition: "transform 0.38s ease, opacity 0.38s ease",
										cursor: "pointer",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 7,
										zIndex: sel ? 20 : inActive ? 12 : 8,
										background: "none",
										border: "none",
										padding: 0,
										font: "inherit",
									}}
								>
									<div
										style={{
											width: ls.r * 2,
											height: ls.r * 2,
											borderRadius: "50%",
											background: ls.fill,
											border: ls.border,
											color: ls.textColor,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: ls.r < 32 ? 10 : 11,
											fontWeight: 700,
											boxShadow: sel
												? "0 0 0 5px rgba(30,58,138,0.16), 0 8px 22px rgba(30,58,138,0.22)"
												: "0 3px 10px rgba(26,34,51,0.08)",
											transition: "box-shadow .2s",
										}}
									>
										{ls.label}
									</div>
									<div
										style={{
											fontSize: 11.5,
											fontWeight: sel ? 700 : 500,
											color: "#1A2233",
											background: "rgba(255,255,255,0.85)",
											padding: "1px 5px",
											borderRadius: 4,
											whiteSpace: "nowrap",
											maxWidth: 130,
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{b.title}
									</div>
								</button>
							);
						})}
					</div>

					{/* Zoom controls */}
					<div
						style={{
							position: "absolute",
							bottom: 16,
							right: 18,
							zIndex: 6,
							display: "flex",
							alignItems: "center",
							gap: 8,
						}}
					>
						<span
							style={{
								fontFamily: "Inter, sans-serif",
								fontSize: 12,
								color: "#8A93A6",
								background: "rgba(255,255,255,0.85)",
								padding: "4px 8px",
								borderRadius: 6,
								minWidth: 44,
								textAlign: "center",
							}}
						>
							{Math.round(view.s * 100)}%
						</span>
						<div
							style={{
								display: "flex",
								background: "#FFFFFF",
								border: "1px solid #E4E7EE",
								borderRadius: 9,
								overflow: "hidden",
								boxShadow: "0 3px 10px rgba(26,34,51,0.08)",
							}}
						>
							<button
								type="button"
								onClick={() => zoomButton(1 / 1.25)}
								style={{
									cursor: "pointer",
									border: "none",
									background: "#FFFFFF",
									color: "#1A2233",
									fontSize: 19,
									width: 38,
									height: 36,
									lineHeight: "1",
								}}
							>
								−
							</button>
							<button
								type="button"
								onClick={fitView}
								style={{
									cursor: "pointer",
									border: "none",
									borderLeft: "1px solid #EDEFF4",
									borderRight: "1px solid #EDEFF4",
									background: "#FFFFFF",
									color: "#5B6577",
									fontFamily: "inherit",
									fontSize: 12,
									padding: "0 12px",
									height: 36,
								}}
							>
								リセット
							</button>
							<button
								type="button"
								onClick={() => zoomButton(1.25)}
								style={{
									cursor: "pointer",
									border: "none",
									background: "#FFFFFF",
									color: "#1A2233",
									fontSize: 18,
									width: 38,
									height: 36,
									lineHeight: "1",
								}}
							>
								+
							</button>
						</div>
					</div>
					<div
						style={{
							position: "absolute",
							bottom: 16,
							left: 18,
							fontSize: 12,
							color: "#A7AEBD",
						}}
					>
						ホイールで拡大縮小・ドラッグで移動
					</div>
				</div>

				{/* Detail panel */}
				<aside
					style={{
						flex: "0 0 360px",
						maxWidth: "100%",
						borderLeft: "1px solid #EBEDF2",
						background: "#FFFFFF",
						padding: "28px 26px",
					}}
				>
					{selected ? (
						<div>
							<div
								style={{
									display: "inline-block",
									fontSize: 12,
									fontWeight: 700,
									padding: "5px 12px",
									borderRadius: 20,
									background: LEVEL_STYLE[selected.level].badgeBg,
									color: LEVEL_STYLE[selected.level].badgeColor,
									border: "1px solid #1E3A8A",
								}}
							>
								{LEVEL_STYLE[selected.level].label}
							</div>
							<h2
								style={{
									fontSize: 22,
									fontWeight: 700,
									letterSpacing: "-0.01em",
									margin: "16px 0 22px",
									lineHeight: 1.4,
								}}
							>
								{selected.title}
							</h2>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 16,
									borderTop: "1px solid #EEF0F5",
									paddingTop: 20,
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										gap: 12,
									}}
								>
									<span style={{ fontSize: 13, color: "#8A93A6" }}>著者</span>
									<span
										style={{
											fontSize: 14,
											fontWeight: 500,
											textAlign: "right",
										}}
									>
										{selected.author ?? "—"}
									</span>
								</div>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										gap: 12,
									}}
								>
									<span style={{ fontSize: 13, color: "#8A93A6" }}>レベル</span>
									<span
										style={{
											fontSize: 14,
											fontWeight: 500,
											textAlign: "right",
										}}
									>
										{LEVEL_STYLE[selected.level].label}
									</span>
								</div>
							</div>
							<a
								href={amazonUrl(selected)}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: "block",
									textAlign: "center",
									textDecoration: "none",
									marginTop: 26,
									background: "#1E3A8A",
									color: "#FFFFFF",
									fontWeight: 700,
									fontSize: 15,
									padding: 14,
									borderRadius: 10,
									boxShadow: "0 6px 18px rgba(30,58,138,0.2)",
								}}
							>
								この本を購入する
							</a>
							<a
								href={`/fields/${fieldSlug}/propose`}
								style={{
									display: "block",
									textAlign: "center",
									textDecoration: "none",
									marginTop: 12,
									background: "#FFFFFF",
									border: "1px solid #D7DCE7",
									color: "#1A2233",
									fontFamily: "inherit",
									fontWeight: 500,
									fontSize: 13.5,
									padding: 12,
									borderRadius: 10,
									cursor: "pointer",
									boxSizing: "border-box",
								}}
							>
								この分野に本を追加提案する
							</a>
						</div>
					) : (
						<div
							style={{
								height: "100%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "flex-start",
								gap: 12,
								padding: "40px 0",
								color: "#9AA2B2",
							}}
						>
							<div
								style={{
									width: 34,
									height: 34,
									borderRadius: "50%",
									border: "1.5px solid #C9CFDC",
								}}
							/>
							<p style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
								グラフのノード（書籍）をクリックすると、
								<br />
								著者・レベル・購入リンクが表示されます。
							</p>
						</div>
					)}
				</aside>
			</div>
		</div>
	);
}
