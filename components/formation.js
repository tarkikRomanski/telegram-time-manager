String.prototype.replaceAll = function (search, replacement) {
    const target = this;
    return target.split(search).join(replacement);
};

String.prototype.prepareText = function () {
    const target = this;
    return target.replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('&', '&amp;');
};

const bold = text => `<strong>${text.prepareText()}</strong>`;
const italic = text => `<em>${text.prepareText()}</em>`;
const link = (href, text) => `<a href="${href}">${text.prepareText()}</a>`;
const code = text => `<code>${text.prepareText()}</code>`;
const pre = text => `<pre>${text.prepareText()}</pre>`;

export {bold, italic, code, link, pre}