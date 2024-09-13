export function getBoolean(value: unknown, defaultValue?: boolean): boolean {
	return typeof value === 'boolean' ? value : defaultValue ?? false;
}
