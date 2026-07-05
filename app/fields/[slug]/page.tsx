import { notFound } from "next/navigation";
import { BookGraph } from "@/components/BookGraph";
import { createClient } from "@/lib/supabase/server";

type Level = "beginner" | "intermediate" | "advanced";

type FieldBook = {
	level: Level;
	books: {
		id: string;
		title: string;
		author: string | null;
		isbn: string | null;
	} | null;
};

type Edge = {
	from_book_id: string;
	to_book_id: string;
};

export default async function FieldPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const supabase = await createClient();

	const { data: field } = await supabase
		.from("fields")
		.select("id, name, slug")
		.eq("slug", slug)
		.single();

	if (!field) notFound();

	const [{ data: fieldBooks }, { data: edges }] = await Promise.all([
		supabase
			.from("field_books")
			.select("level, books(id, title, author, isbn)")
			.eq("field_id", field.id),
		supabase
			.from("edges")
			.select("from_book_id, to_book_id")
			.eq("field_id", field.id),
	]);

	const rawFieldBooks = (fieldBooks ?? []) as unknown as FieldBook[];
	const books = rawFieldBooks
		.filter(
			(fb): fb is FieldBook & { books: NonNullable<FieldBook["books"]> } =>
				fb.books !== null && !Array.isArray(fb.books),
		)
		.map((fb) => ({ ...fb.books, level: fb.level }));

	const rawEdges = ((edges ?? []) as Edge[]).map((e) => ({
		fromId: e.from_book_id,
		toId: e.to_book_id,
	}));

	return (
		<BookGraph
			fieldName={field.name}
			fieldSlug={field.slug}
			rawBooks={books}
			rawEdges={rawEdges}
		/>
	);
}
