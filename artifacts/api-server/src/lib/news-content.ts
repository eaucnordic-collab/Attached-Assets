const ALLOWED_TAGS = /^(p|br|strong|b|em|i|h2|h3|blockquote|ul|ol|li|a|img)$/i;

/** Removes Word/browser-only markup while retaining the article's semantic HTML. */
export function sanitizeNewsHtml(value: string | null | undefined): string | null {
  if (!value) return null;
  return value
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<o:p\b[^>]*>[\s\S]*?<\/o:p>/gi, '')
    .replace(/<\/?o:[^>]*>/gi, '')
    .replace(/<([^>]+)>/g, (full, rawTag: string) => {
      const match = rawTag.match(/^\/?\s*([a-z0-9]+)/i);
      if (!match || !ALLOWED_TAGS.test(match[1])) return '';
      const closing = /^\s*\//.test(rawTag);
      if (closing) return `</${match[1].toLowerCase()}>`;
      if (match[1].toLowerCase() === 'br') return '<br>';
      if (match[1].toLowerCase() === 'img') {
        const src = rawTag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
        const alt = rawTag.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1] ?? 'Article image';
        return /^(https?:\/\/|\/api\/storage\/)/i.test(src)
          ? `<img src="${src}" alt="${alt.replace(/"/g, '&quot;')}" loading="lazy">`
          : '';
      }
      if (match[1].toLowerCase() === 'a') {
        const href = rawTag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
        return /^(https?:|mailto:|tel:)/i.test(href)
          ? `<a href="${href.replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">`
          : '<a>';
      }
      return `<${match[1].toLowerCase()}>`;
    })
    .replace(/<(h[23])>\s*<\/\1>/gi, '')
    .replace(/(?:&nbsp;|\u00a0)+/gi, ' ')
    .trim() || null;
}

export function generateNewsExcerpt(value: string | null | undefined, maxLength = 240): string | null {
  const html = sanitizeNewsHtml(value);
  if (!html) return null;
  const text = html
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|lt|gt|quot);/gi, (entity) => ({
      '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
    }[entity.toLowerCase()] ?? ' '))
    .replace(/\s+/g, ' ')
    .trim();
  return text ? (text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text) : null;
}