const ALLOWED_TAGS = new Set([
  'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'H2', 'H3',
  'BLOCKQUOTE', 'A', 'UL', 'OL', 'LI', 'IMG',
]);
const BLOCK_TAGS = new Set(['P', 'H2', 'H3', 'BLOCKQUOTE', 'UL', 'OL', 'LI']);

export function sanitizeArticleHtml(value: string): string {
  if (typeof DOMParser === 'undefined') return '';

  const parsed = new DOMParser().parseFromString(value, 'text/html');

  const cleanNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent ?? '');
    }
    if (!(node instanceof Element)) return null;

    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src')?.trim() ?? '';
      if (!/^(https?:\/\/|\/api\/storage\/)/i.test(src)) return null;
      const image = document.createElement('img');
      image.setAttribute('src', src);
      image.setAttribute('alt', node.getAttribute('alt')?.trim() || 'Article image');
      image.setAttribute('loading', 'lazy');
      return image;
    }

    const children = Array.from(node.childNodes)
      .map(cleanNode)
      .filter((child): child is Node => child !== null);

    if (node.tagName === 'DIV') {
      const hasBlockChildren = Array.from(node.children).some((child) => BLOCK_TAGS.has(child.tagName));
      if (hasBlockChildren) {
        const fragment = document.createDocumentFragment();
        children.forEach((child) => fragment.appendChild(child));
        return fragment;
      }
      const paragraph = document.createElement('p');
      children.forEach((child) => paragraph.appendChild(child));
      return paragraph.textContent?.trim() || paragraph.querySelector('img') ? paragraph : null;
    }

    if (!ALLOWED_TAGS.has(node.tagName)) {
      const fragment = document.createDocumentFragment();
      children.forEach((child) => fragment.appendChild(child));
      return fragment;
    }

    const element = document.createElement(node.tagName.toLowerCase());
    if (node.tagName === 'A') {
      const href = node.getAttribute('href')?.trim() ?? '';
      if (/^(https?:|mailto:|tel:)/i.test(href)) {
        element.setAttribute('href', href);
        element.setAttribute('target', '_blank');
        element.setAttribute('rel', 'noopener noreferrer');
      }
    }
    children.forEach((child) => element.appendChild(child));
    if (node.tagName === 'P' && !element.textContent?.trim() && !element.querySelector('img')) {
      return null;
    }
    return element;
  };

  const container = document.createElement('div');
  Array.from(parsed.body.childNodes).forEach((node) => {
    const clean = cleanNode(node);
    if (clean) container.appendChild(clean);
  });
  return container.innerHTML;
}

export function articleContentToHtml(value: string): string {
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeArticleHtml(value);
  return value
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>`)
    .join('');
}