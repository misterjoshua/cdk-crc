export function stripTags(html: string): string {
  return html
    .replace(/<(.*?)>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '-')
    .trim();
}
