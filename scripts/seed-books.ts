import * as fs from "node:fs";
import * as path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error(
		"Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
	);
	process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: { persistSession: false },
});

function normalizeTitle(title: string): string {
	return title
		.trim()
		.replace(/[\s　]*(第\d+版|新版|改訂\d+版|増補改訂版|補訂版)[\s　]*/g, "")
		.replace(/[\s　]*[[【(（].*?[\]】)）][\s　]*/g, "")
		.replace(/\s+/g, " ")
		.toLowerCase()
		.trim();
}

function firstAuthor(author: string): string {
	return author
		.split(/[/・,、]/)[0]
		.trim()
		.toLowerCase();
}

type Book = { title: string; author: string };

async function main() {
	const root = process.cwd();

	const existingRaw = fs.readFileSync(
		path.join(root, "data/management-books-existing.csv"),
		"utf-8",
	);
	const existingRecords = parse(existingRaw, {
		columns: true,
		skip_empty_lines: true,
	}) as Array<{ title: string; author: string }>;

	const syllabusRaw = fs.readFileSync(
		path.join(root, "data/university-syllabus-management-books.csv"),
		"utf-8",
	);
	const syllabusRecords = parse(syllabusRaw, {
		columns: true,
		skip_empty_lines: true,
	}) as Array<{ title: string; author: string }>;

	// 重複除去: タイトル正規化 + 第一著者で判定
	const seen = new Map<string, Book>();

	for (const r of existingRecords) {
		const key = `${normalizeTitle(r.title)}__${firstAuthor(r.author)}`;
		if (!seen.has(key)) seen.set(key, { title: r.title, author: r.author });
	}

	let syllabusNew = 0;
	let syllabusSkipped = 0;
	for (const r of syllabusRecords) {
		const key = `${normalizeTitle(r.title)}__${firstAuthor(r.author)}`;
		if (!seen.has(key)) {
			seen.set(key, { title: r.title, author: r.author });
			syllabusNew++;
		} else {
			syllabusSkipped++;
		}
	}

	const books = Array.from(seen.values());

	console.log(`既存CSV:       ${existingRecords.length} 件`);
	console.log(
		`シラバスCSV:   ${syllabusRecords.length} 件 (新規 ${syllabusNew} 件 / 重複スキップ ${syllabusSkipped} 件)`,
	);
	console.log(`統合後ユニーク: ${books.length} 件`);
	console.log("---");

	// テーブルをクリアして再投入（冪等性確保）
	const { error: deleteError } = await supabase
		.from("books")
		.delete()
		.not("id", "is", null);
	if (deleteError) {
		console.error("テーブルクリア失敗:", deleteError.message);
		process.exit(1);
	}

	// バッチ投入
	const BATCH = 50;
	let inserted = 0;
	for (let i = 0; i < books.length; i += BATCH) {
		const batch = books.slice(i, i + BATCH);
		const { error } = await supabase.from("books").insert(batch);
		if (error) {
			console.error("挿入エラー:", error.message);
			process.exit(1);
		}
		inserted += batch.length;
	}

	console.log(`✓ books テーブルに ${inserted} 件を登録しました。`);
}

main();
