import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
	process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
	{ auth: { persistSession: false } },
);

// -----------------------------------------------------------------------
// フィールド定義
// -----------------------------------------------------------------------
const FIELD = { name: "経営学", slug: "business-administration" };

// -----------------------------------------------------------------------
// レベル別書籍: [title, authorFragment] authorFragment は同名書籍の識別用
// -----------------------------------------------------------------------
type BookRef = { title: string; author?: string };

const BEGINNER: BookRef[] = [
	{ title: "経営学入門", author: "藤田" }, // 藤田 誠版
	{ title: "経営学入門", author: "武石" }, // 武石彰版（シラバス由来）
	{ title: "経営学とはなにか" },
	{ title: "ゼミナール経営学入門" },
	{ title: "領域を超える経営学" },
	{ title: "経営管理 (新版)" },
	{ title: "世界は経営でできている" },
	{ title: "逆・タイムマシン経営論" },
	{ title: "[新版] MBA経営戦略" },
];

const INTERMEDIATE: BookRef[] = [
	{ title: "世界標準の経営理論" },
	{ title: "経営戦略入門" },
	{ title: "経営戦略の論理 (第4版)" },
	{ title: "競争戦略論I" },
	{ title: "ストーリーとしての競争戦略" },
	{ title: "組織論 (補訂版)" },
	{ title: "組織行動のマネジメント (新版)" },
	{ title: "知識創造企業 (新装版)" },
	{ title: "失敗の本質" },
	{ title: "両利きの経営" },
	{ title: "イノベーションのジレンマ (増補改訂版)" },
	{ title: "アントレプレナーシップ", author: "清水" }, // 清水 洋版
	{ title: "コトラー&ケラーのマーケティング・マネジメント 基本編" },
];

const ADVANCED: BookRef[] = [
	{ title: "企業戦略論", author: "バーニー" }, // 単巻版
	{ title: "企業戦略論[上]基本編:競争優位の構築と持続" },
	{ title: "企業戦略論[中]事業戦略編:競争優位の構築と持続" },
	{ title: "企業戦略論[下]全社戦略編:競争優位の構築と持続" },
	{ title: "知識創造の方法論" },
	{ title: "経営戦略の思考法" },
	{ title: "組織の不条理" },
	{ title: "リサーチ・デザイン" },
	{ title: "企業評価の組織論的研究" },
	{ title: "経営の知的思考" },
];

// -----------------------------------------------------------------------
// エッジ定義: [fromRef, toRef]
// -----------------------------------------------------------------------
type EdgeDef = [BookRef, BookRef];

const EDGES: EdgeDef[] = [
	// 初級 → 中級
	[{ title: "経営学入門", author: "藤田" }, { title: "経営戦略入門" }],
	[{ title: "経営学入門", author: "藤田" }, { title: "世界標準の経営理論" }],
	[{ title: "経営学入門", author: "藤田" }, { title: "組織論 (補訂版)" }],
	[{ title: "経営学とはなにか" }, { title: "経営戦略入門" }],
	[{ title: "ゼミナール経営学入門" }, { title: "経営戦略の論理 (第4版)" }],
	[{ title: "ゼミナール経営学入門" }, { title: "世界標準の経営理論" }],
	[{ title: "経営管理 (新版)" }, { title: "組織行動のマネジメント (新版)" }],
	// 中級 → 中級
	[{ title: "経営戦略入門" }, { title: "経営戦略の論理 (第4版)" }],
	[{ title: "経営戦略入門" }, { title: "競争戦略論I" }],
	[{ title: "組織論 (補訂版)" }, { title: "知識創造企業 (新装版)" }],
	// 中級 → 上級
	[{ title: "競争戦略論I" }, { title: "企業戦略論", author: "バーニー" }],
	[
		{ title: "競争戦略論I" },
		{ title: "企業戦略論[上]基本編:競争優位の構築と持続" },
	],
	[{ title: "知識創造企業 (新装版)" }, { title: "知識創造の方法論" }],
	[{ title: "経営戦略の論理 (第4版)" }, { title: "経営戦略の思考法" }],
	[{ title: "ストーリーとしての競争戦略" }, { title: "経営戦略の思考法" }],
	[
		{ title: "イノベーションのジレンマ (増補改訂版)" },
		{ title: "両利きの経営" },
	],
	[
		{ title: "[新版] MBA経営戦略" },
		{ title: "企業戦略論", author: "バーニー" },
	],
	[{ title: "失敗の本質" }, { title: "組織の不条理" }],
	// 上級 → 上級
	[
		{ title: "企業戦略論[上]基本編:競争優位の構築と持続" },
		{ title: "企業戦略論[中]事業戦略編:競争優位の構築と持続" },
	],
	[
		{ title: "企業戦略論[中]事業戦略編:競争優位の構築と持続" },
		{ title: "企業戦略論[下]全社戦略編:競争優位の構築と持続" },
	],
	[
		{ title: "企業戦略論", author: "バーニー" },
		{ title: "企業戦略論[上]基本編:競争優位の構築と持続" },
	],
];

// -----------------------------------------------------------------------
// ユーティリティ
// -----------------------------------------------------------------------
type BookRow = { id: string; title: string; author: string };

function findBook(books: BookRow[], ref: BookRef): BookRow | undefined {
	const candidates = books.filter((b) => b.title === ref.title);
	if (candidates.length === 1) return candidates[0];
	if (ref.author) {
		return candidates.find((b) => b.author.includes(ref.author as string));
	}
	return candidates[0];
}

// -----------------------------------------------------------------------
// メイン
// -----------------------------------------------------------------------
async function main() {
	// 全書籍取得
	const { data: allBooks, error: booksError } = await supabase
		.from("books")
		.select("id,title,author");
	if (booksError) {
		console.error("books 取得失敗:", booksError.message);
		process.exit(1);
	}
	const books = allBooks as BookRow[];

	// フィールド作成（既存削除 → 再作成で冪等化）
	await supabase.from("fields").delete().eq("slug", FIELD.slug);
	const { data: fieldData, error: fieldError } = await supabase
		.from("fields")
		.insert(FIELD)
		.select()
		.single();
	if (fieldError) {
		console.error("fields 挿入失敗:", fieldError.message);
		process.exit(1);
	}
	const fieldId = fieldData.id as string;
	console.log(`✓ field 作成: ${FIELD.name} (${fieldId})`);

	// book ID 解決
	function resolveId(ref: BookRef, label: string): string | null {
		const book = findBook(books, ref);
		if (!book) {
			console.warn(`  ⚠ 書籍が見つかりません: "${ref.title}" (${label})`);
			return null;
		}
		return book.id;
	}

	// field_books 挿入
	const fieldBooksRows: { field_id: string; book_id: string; level: string }[] =
		[];
	const levels: [BookRef[], string][] = [
		[BEGINNER, "beginner"],
		[INTERMEDIATE, "intermediate"],
		[ADVANCED, "advanced"],
	];
	for (const [refs, level] of levels) {
		for (const ref of refs) {
			const id = resolveId(ref, level);
			if (id) fieldBooksRows.push({ field_id: fieldId, book_id: id, level });
		}
	}

	const { error: fbError } = await supabase
		.from("field_books")
		.insert(fieldBooksRows);
	if (fbError) {
		console.error("field_books 挿入失敗:", fbError.message);
		process.exit(1);
	}
	console.log(`✓ field_books: ${fieldBooksRows.length} 件`);

	// edges 挿入
	const edgeRows: {
		field_id: string;
		from_book_id: string;
		to_book_id: string;
	}[] = [];
	for (const [fromRef, toRef] of EDGES) {
		const fromId = resolveId(fromRef, "edge-from");
		const toId = resolveId(toRef, "edge-to");
		if (fromId && toId) {
			edgeRows.push({
				field_id: fieldId,
				from_book_id: fromId,
				to_book_id: toId,
			});
		}
	}

	const { error: edgeError } = await supabase.from("edges").insert(edgeRows);
	if (edgeError) {
		console.error("edges 挿入失敗:", edgeError.message);
		process.exit(1);
	}
	console.log(`✓ edges: ${edgeRows.length} 件`);
	console.log("---");
	console.log(
		`完了 — field_books ${fieldBooksRows.length} 件 / edges ${edgeRows.length} 件`,
	);
}

main();
