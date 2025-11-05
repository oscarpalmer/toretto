import {
	getSanitizeOptions,
	type SanitizeOptions,
	sanitizeNodes,
} from './internal/sanitize';

/**
 * Sanitize one or more nodes, recursively
 * @param value Node or nodes to sanitize
 * @param options Sanitization options
 * @returns Sanitized nodes
 */
export function sanitize(
	value: Node | Node[],
	options?: SanitizeOptions,
): Node[] {
	return sanitizeNodes(
		Array.isArray(value) ? value : [value],
		getSanitizeOptions(options),
	);
}
