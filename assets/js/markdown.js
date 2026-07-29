/**
 * Renderizador Markdown pequeño y seguro para el portal estático.
 *
 * No ejecuta HTML embebido ni scripts. El Markdown original se conserva en
 * data-raw-markdown para copiarlo o descargarlo sin alterar su formato.
 */

function escapeHtml(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function safeHref(href, baseUrl = '') {
    const value = href.trim();
    if (!/^(https?:\/\/|mailto:|#|\.{0,2}\/|[a-zA-Z0-9_.-]+(?:\/|$))/i.test(value)) return '#';
    if (!baseUrl || /^(https?:\/\/|mailto:|#)/i.test(value)) return value;
    try {
        return new URL(value, baseUrl).href;
    } catch {
        return '#';
    }
}

function inlineMarkdown(value = '', options = {}) {
    const code = [];
    let text = String(value).replace(/`([^`]+)`/g, (_, content) => {
        const token = `\u0000CODE${code.length}\u0000`;
        code.push(`<code>${escapeHtml(content)}</code>`);
        return token;
    });

    text = escapeHtml(text)
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, href) =>
            `<img src="${safeHref(href, options.baseUrl)}" alt="${alt}" loading="lazy">`)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) =>
            `<a href="${safeHref(href, options.baseUrl)}" target="_blank" rel="noopener">${label}</a>`)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]+)__/g, '<strong>$1</strong>')
        .replace(/~~([^~]+)~~/g, '<del>$1</del>')
        .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
        .replace(/(^|[\s(])_([^_\n]+)_/g, '$1<em>$2</em>');

    code.forEach((snippet, index) => {
        text = text.replace(`\u0000CODE${index}\u0000`, snippet);
    });
    return text;
}

function withoutFrontMatter(source) {
    const normalized = String(source || '').replace(/\r\n?/g, '\n');
    if (!normalized.startsWith('---\n')) return normalized;
    const end = normalized.indexOf('\n---\n', 4);
    return end === -1 ? normalized : normalized.slice(end + 5);
}

function isBlockStart(lines, index) {
    const line = lines[index] || '';
    const next = lines[index + 1] || '';
    return !line.trim()
        || /^```/.test(line)
        || /^#{1,6}\s+/.test(line)
        || /^>\s?/.test(line)
        || /^\s*([-+*]|\d+\.)\s+/.test(line)
        || /^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)
        || (line.includes('|') && /^\s*\|?\s*:?-{3,}/.test(next));
}

export function renderMarkdown(source, options = {}) {
    const lines = withoutFrontMatter(source).split('\n');
    const html = [];

    for (let index = 0; index < lines.length;) {
        const line = lines[index];
        if (!line.trim()) {
            index += 1;
            continue;
        }

        const fence = line.match(/^```\s*([\w-]*)/);
        if (fence) {
            const language = fence[1];
            const body = [];
            index += 1;
            while (index < lines.length && !/^```/.test(lines[index])) {
                body.push(lines[index]);
                index += 1;
            }
            if (index < lines.length) index += 1;
            html.push(`<pre tabindex="0" role="region" aria-label="Bloque de código"><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(body.join('\n'))}</code></pre>`);
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            const level = heading[1].length;
            html.push(`<h${level}>${inlineMarkdown(heading[2], options)}</h${level}>`);
            index += 1;
            continue;
        }

        if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) {
            html.push('<hr>');
            index += 1;
            continue;
        }

        if (/^>\s?/.test(line)) {
            const quote = [];
            while (index < lines.length && /^>\s?/.test(lines[index])) {
                quote.push(lines[index].replace(/^>\s?/, ''));
                index += 1;
            }
            html.push(`<blockquote>${inlineMarkdown(quote.join(' '), options)}</blockquote>`);
            continue;
        }

        if (line.includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] || '')) {
            const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
            const headers = cells(line);
            index += 2;
            const rows = [];
            while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
                rows.push(cells(lines[index]));
                index += 1;
            }
            html.push(`<div class="table-scroll" tabindex="0" role="region" aria-label="Tabla desplazable"><table><thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(cell, options)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell, options)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
            continue;
        }

        const list = line.match(/^\s*([-+*]|\d+\.)\s+(.+)$/);
        if (list) {
            const ordered = /\d+\./.test(list[1]);
            const tag = ordered ? 'ol' : 'ul';
            const items = [];
            while (index < lines.length) {
                const item = lines[index].match(/^\s*([-+*]|\d+\.)\s+(.+)$/);
                if (!item || /\d+\./.test(item[1]) !== ordered) break;
                const task = item[2].match(/^\[([ xX])\]\s+(.+)$/);
                items.push(task
                    ? `<li class="task-item"><input type="checkbox" disabled${task[1].toLowerCase() === 'x' ? ' checked' : ''}> ${inlineMarkdown(task[2], options)}</li>`
                    : `<li>${inlineMarkdown(item[2], options)}</li>`);
                index += 1;
            }
            html.push(`<${tag}>${items.join('')}</${tag}>`);
            continue;
        }

        const paragraph = [line.trim()];
        index += 1;
        while (index < lines.length && !isBlockStart(lines, index)) {
            paragraph.push(lines[index].trim());
            index += 1;
        }
        html.push(`<p>${inlineMarkdown(paragraph.join(' '), options)}</p>`);
    }

    return html.join('');
}

export function setMarkdownContent(target, source, options = {}) {
    if (!target) return;
    const raw = String(source || '');
    target.dataset.rawMarkdown = raw;
    target.dataset.loadError = 'false';
    target.dataset.loadState = 'ready';
    target.classList.add('markdown-body');
    target.innerHTML = renderMarkdown(raw, options);
}
