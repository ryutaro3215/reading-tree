import posthog from "posthog-js";

export type PostHogEvent =
	| "page_view"
	| "cta_click_hero"
	| "cta_click_footer"
	| "tree_node_click"
	| "proposal_submitted"
	| "proposal_approved";

export function capture(
	event: PostHogEvent,
	properties?: Record<string, unknown>,
) {
	if (typeof window === "undefined") return;
	posthog.capture(event, properties);
}
