const prepareText = (text = '') => {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

const bold = text => `<strong>${prepareText(text)}</strong>`;

export {bold};