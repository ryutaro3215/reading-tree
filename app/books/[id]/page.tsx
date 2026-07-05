import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

type Level = "beginner" | "intermediate" | "advanced";

const LEVEL_LABEL: Record<Level, string> = {
	beginner: "初級",
	intermediate: "中級",
	advanced: "専門",
};

const LEVEL_STYLE: Record<Level, { bg: string; color: string }> = {
	beginner: { bg: "rgba(30,58,138,0.10)", color: "#1E3A8A" },
	intermediate: { bg: "rgba(30,58,138,0.16)", color: "#1E3A8A" },
	advanced: { bg: "#1E3A8A", color: "#FFFFFF" },
};

function amazonUrl(book: { title: string; isbn: string | null }): string {
	if (book.isbn) return `https://www.amazon.co.jp/dp/${book.isbn}`;
	return `https://www.amazon.co.jp/s?k=${encodeURIComponent(book.title)}`;
}

function coverUrl(isbn: string | null): string | null {
	if (!isbn) return null;
	return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

export default async function BookPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();

	const { data: book } = await supabase
		.from("books")
		.select("id, title, author, isbn")
		.eq("id", id)
		.single();

	if (!book) notFound();

	const { data: fieldBook } = await supabase
		.from("field_books")
		.select("level, fields(id, name, slug)")
		.eq("book_id", id)
		.maybeSingle();

	const level = fieldBook?.level as Level | null;
	const field = fieldBook?.fields as unknown as {
		id: string;
		name: string;
		slug: string;
	} | null;
	const cover = coverUrl(book.isbn);

	return (
		<div
			style={{
				fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
				color: "#1A2233",
				background: "#F6F7FA",
				minHeight: "100vh",
			}}
		>
			{/* Header */}
			<header
				style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEDF2" }}
			>
				<div
					style={{
						maxWidth: 1000,
						margin: "0 auto",
						padding: "16px 24px",
						display: "flex",
						alignItems: "center",
						gap: 16,
					}}
				>
					<Link
						href={field ? `/fields/${field.slug}` : "/"}
						style={{
							textDecoration: "none",
							color: "#8A93A6",
							fontSize: 13,
							display: "inline-flex",
							alignItems: "center",
							gap: 5,
						}}
					>
						<span style={{ fontSize: 15 }}>←</span>
						{field ? `${field.name}のツリーに戻る` : "トップへ戻る"}
					</Link>
				</div>
			</header>

			{/* Main */}
			<main style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "240px 1fr",
						gap: 48,
						alignItems: "start",
					}}
				>
					{/* 左：書影 */}
					<div>
						{cover ? (
							<img
								src={cover}
								alt={`${book.title} の表紙`}
								style={{
									width: "100%",
									borderRadius: 12,
									boxShadow: "0 8px 24px rgba(26,34,51,0.12)",
									background: "#FFFFFF",
								}}
								onError={undefined}
							/>
						) : (
							<div
								style={{
									width: "100%",
									aspectRatio: "2/3",
									borderRadius: 12,
									background: "#E4E7EE",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 40,
								}}
							>
								📚
							</div>
						)}
					</div>

					{/* 右：書籍情報 */}
					<div>
						{level && (
							<div
								style={{
									display: "inline-block",
									fontSize: 12,
									fontWeight: 700,
									padding: "5px 14px",
									borderRadius: 20,
									background: LEVEL_STYLE[level].bg,
									color: LEVEL_STYLE[level].color,
									marginBottom: 16,
								}}
							>
								{LEVEL_LABEL[level]}
							</div>
						)}

						<h1
							style={{
								fontSize: "clamp(22px, 3vw, 32px)",
								fontWeight: 700,
								lineHeight: 1.4,
								letterSpacing: "-0.01em",
								margin: "0 0 16px",
							}}
						>
							{book.title}
						</h1>

						{book.author && (
							<p style={{ fontSize: 16, color: "#5B6577", margin: "0 0 32px" }}>
								{book.author}
							</p>
						)}

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 12,
								padding: "24px 0",
								borderTop: "1px solid #E4E7EE",
								borderBottom: "1px solid #E4E7EE",
								marginBottom: 32,
							}}
						>
							{book.isbn && (
								<div style={{ display: "flex", gap: 12 }}>
									<span
										style={{
											fontSize: 13,
											color: "#8A93A6",
											width: 60,
											flexShrink: 0,
										}}
									>
										ISBN
									</span>
									<span
										style={{
											fontSize: 13,
											color: "#1A2233",
											fontFamily: "monospace",
										}}
									>
										{book.isbn}
									</span>
								</div>
							)}
							{field && (
								<div style={{ display: "flex", gap: 12 }}>
									<span
										style={{
											fontSize: 13,
											color: "#8A93A6",
											width: 60,
											flexShrink: 0,
										}}
									>
										分野
									</span>
									<Link
										href={`/fields/${field.slug}`}
										style={{
											fontSize: 13,
											color: "#1E3A8A",
											textDecoration: "none",
										}}
									>
										{field.name} →
									</Link>
								</div>
							)}
						</div>

						<a
							href={amazonUrl(book)}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: "inline-block",
								textDecoration: "none",
								background: "#1E3A8A",
								color: "#FFFFFF",
								fontWeight: 700,
								fontSize: 15,
								padding: "14px 32px",
								borderRadius: 10,
								boxShadow: "0 6px 18px rgba(30,58,138,0.2)",
							}}
						>
							Amazonで購入する
						</a>
					</div>
				</div>
			</main>
		</div>
	);
}
