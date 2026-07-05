import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type BookmarkRow = {
	book_id: string;
	books: {
		id: string;
		title: string;
		author: string | null;
		isbn: string | null;
	} | null;
};

function amazonUrl(book: { title: string; isbn: string | null }): string {
	if (book.isbn) return `https://www.amazon.co.jp/dp/${book.isbn}`;
	return `https://www.amazon.co.jp/s?k=${encodeURIComponent(book.title)}`;
}

export default async function MyPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) notFound();

	const { data: rows } = await supabase
		.from("bookmarks")
		.select("book_id, books(id, title, author, isbn)")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	const bookmarks = ((rows ?? []) as unknown as BookmarkRow[]).filter(
		(r): r is BookmarkRow & { books: NonNullable<BookmarkRow["books"]> } =>
			r.books !== null && !Array.isArray(r.books),
	);

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
						maxWidth: 900,
						margin: "0 auto",
						padding: "18px 24px",
						display: "flex",
						alignItems: "center",
						gap: 16,
					}}
				>
					<Link
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
					</Link>
					<div style={{ width: 1, height: 20, background: "#E4E7EE" }} />
					<h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
						マイページ
					</h1>
				</div>
			</header>

			{/* Content */}
			<main
				style={{
					maxWidth: 900,
					margin: "0 auto",
					padding: "40px 24px",
				}}
			>
				<h2
					style={{
						fontSize: 16,
						fontWeight: 700,
						color: "#5B6577",
						letterSpacing: "0.05em",
						textTransform: "uppercase",
						margin: "0 0 20px",
					}}
				>
					保存した書籍 ({bookmarks.length}冊)
				</h2>

				{bookmarks.length === 0 ? (
					<div
						style={{
							textAlign: "center",
							padding: "80px 24px",
							color: "#9AA2B2",
						}}
					>
						<p style={{ fontSize: 15, margin: "0 0 20px" }}>
							保存した書籍がありません。
						</p>
						<Link
							href="/fields/business-administration"
							style={{
								textDecoration: "none",
								background: "#1E3A8A",
								color: "#FFFFFF",
								fontWeight: 700,
								fontSize: 14,
								padding: "12px 24px",
								borderRadius: 9,
							}}
						>
							経営学のツリーを見る
						</Link>
					</div>
				) : (
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
							gap: 16,
						}}
					>
						{bookmarks.map(({ books: book }) => (
							<div
								key={book.id}
								style={{
									background: "#FFFFFF",
									border: "1px solid #E4E7EE",
									borderRadius: 14,
									padding: "22px 20px",
									display: "flex",
									flexDirection: "column",
									gap: 12,
								}}
							>
								<h3
									style={{
										fontSize: 15,
										fontWeight: 700,
										margin: 0,
										lineHeight: 1.5,
									}}
								>
									{book.title}
								</h3>
								{book.author && (
									<p
										style={{
											fontSize: 13,
											color: "#5B6577",
											margin: 0,
										}}
									>
										{book.author}
									</p>
								)}
								<a
									href={amazonUrl(book)}
									target="_blank"
									rel="noopener noreferrer"
									style={{
										display: "block",
										textAlign: "center",
										textDecoration: "none",
										marginTop: "auto",
										background: "#1E3A8A",
										color: "#FFFFFF",
										fontWeight: 700,
										fontSize: 13,
										padding: "10px",
										borderRadius: 8,
									}}
								>
									購入する
								</a>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
