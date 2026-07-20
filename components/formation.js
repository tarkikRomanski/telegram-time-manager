const prepareText = (text = '') => {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

const bold = text => `<strong>${prepareText(text)}</strong>`;
const italic = text => `<em>${prepareText(text)}</em>`;
const link = (href, text) => `<a href="${href}">${prepareText(text)}</a>`;
const code = text => `<code>${prepareText(text)}</code>`;
const pre = text => `<pre>${prepareText(text)}</pre>`;

export {bold, italic, code, link, pre, prepareText};