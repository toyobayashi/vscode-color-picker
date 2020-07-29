/**
 * @returns New array with all falsy values removed. The original array IS NOT modified.
 */
export function coalesce<T>(array: ReadonlyArray<T | undefined | null>): T[] {
	return <T[]>array.filter(e => !!e);
}
