
export function sanitizeMessageContent(
  content: string,
): string {
  return content.replace(/\0/g, '');
}