// utils/url.ts
export function getMessengerLink(url: string) {
  const ts = Date.now(); // timestamp hiện tại
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}ts=${ts}`;
}
