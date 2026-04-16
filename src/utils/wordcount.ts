/**
 * Checks word count by splitting on whitespace and filtering empty strings.
 */
export function getWordCount(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}
