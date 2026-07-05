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
	// 経営戦略・組織
	{ title: "経営学入門", author: "藤田" }, // 藤田 誠版
	{ title: "経営学とはなにか" },
	{ title: "ゼミナール経営学入門" },
	{ title: "世界は経営でできている" },
	{ title: "[新版] MBA経営戦略" },
	// マーケティング
	{ title: "大学4年間のマーケティングが10時間でざっと学べる" }, // 阿部誠 / KADOKAWA
	{ title: "1からのマーケティング" }, // 石井淳蔵他 / 碩学舎
	{ title: "マーケティング〈第2版〉" }, // 恩蔵直人 / 日経文庫
	{ title: "わかりやすいマーケティング戦略" }, // 沼上幹 / 有斐閣アルマ
	// 財務・ファイナンス
	{ title: "よくわかるファイナンス" }, // 久保田敬一
	{ title: "ざっくり分かるファイナンス" }, // 石野雄一
	{ title: "財務3表一体理解法" }, // 國貞克則
	{ title: "実況！ビジネス力養成講義 ファイナンス" }, // 石野雄一 / 日経BP
];

const INTERMEDIATE: BookRef[] = [
	// 経営戦略・組織
	{ title: "経営学入門", author: "武石" }, // 武石彰版（シラバス由来）
	{ title: "世界標準の経営理論" },
	{ title: "経営戦略入門" },
	{ title: "経営戦略の論理 (第4版)" },
	{ title: "競争戦略論I" },
	{ title: "ストーリーとしての競争戦略" },
	{ title: "経営管理 (新版)" },
	{ title: "組織論 (補訂版)" },
	{ title: "組織行動のマネジメント (新版)" },
	{ title: "両利きの経営" },
	{ title: "企業戦略論", author: "バーニー" }, // 単巻版
	{ title: "企業戦略論[上]基本編:競争優位の構築と持続" },
	{ title: "企業戦略論[中]事業戦略編:競争優位の構築と持続" },
	{ title: "企業戦略論[下]全社戦略編:競争優位の構築と持続" },
	// マーケティング
	{ title: "マーケティング戦略〔第6版〕" }, // 和田充夫・恩藏直人・三浦俊彦 / 有斐閣アルマ
	{ title: "売れるもマーケ 当たるもマーケ" },
	{ title: "マーケティングをつかむ [第3版]" },
	{ title: "人がうごく コンテンツのつくり方" },
	// 財務・ファイナンス
	{ title: "道具としてのファイナンス" }, // 石野雄一
	{ title: "コーポレートファイナンス 入門編 [第2版]" }, // バーク/ディマーゾ
	{ title: "新・現代会計入門 第5版" }, // 伊藤邦雄
	{ title: "コーポレートファイナンス 戦略と実践" }, // 田中慎一・保田隆明 / ダイヤモンド社
	{ title: "ゼミナール コーポレートファイナンス" }, // 朝岡大輔・砂川伸幸・岡田紀子 / 日経BP
	{ title: "基本から本格的に学ぶ人のためのファイナンス入門" }, // 手嶋宣之 / ダイヤモンド社
];

const ADVANCED: BookRef[] = [
	// 経営戦略・組織
	{ title: "逆・タイムマシン経営論" },
	{ title: "失敗の本質" },
	{ title: "知識創造企業 (新装版)" },
	{ title: "領域を超える経営学" },
	{ title: "知識創造の方法論" },
	{ title: "経営戦略の思考法" },
	{ title: "組織の不条理" },
	{ title: "企業評価の組織論的研究" },
	{ title: "経営の知的思考" },
	{ title: "イノベーションのジレンマ (増補改訂版)" },
	{ title: "アントレプレナーシップ", author: "清水" }, // 清水 洋版
	// マーケティング
	{ title: "コトラー&ケラーのマーケティング・マネジメント 基本編" },
	{ title: "現代広告論 [第4版]" },
	// 財務・ファイナンス
	{ title: "財務会計の思考法" }, // 田口聡志
	{ title: "財務会計講義 (第25版)" }, // 桜井久勝
	{ title: "コーポレート・ファイナンス 第10版（上）" }, // ブリーリー・マイヤーズ・アレン / 日経BP
	{ title: "企業価値評価 第7版（上）" }, // マッキンゼー / ダイヤモンド社
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
