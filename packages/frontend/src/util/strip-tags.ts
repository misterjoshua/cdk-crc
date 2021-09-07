export function stripTags(html: string): string {
  return html.replace(/<(.*?)>/g, '').trim();
}
