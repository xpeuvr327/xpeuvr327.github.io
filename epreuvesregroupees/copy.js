function copyToClipboard(e) {
    navigator.clipboard ? navigator.clipboard.writeText(e).catch(() => {
        fallbackCopyTextToClipboard(e)
    }) : fallbackCopyTextToClipboard(e)
}

function fallbackCopyTextToClipboard(e) {
    let t = document.createElement("textarea");
    t.value = e, document.body.appendChild(t), t.focus(), t.select(), document.execCommand("copy"), document.body.removeChild(t)
}
document.getElementById("shareLink").addEventListener("click", function() {
    let e = this.getAttribute("data-targetUrl");
    copyToClipboard(e)
});

function copyToClipboardAlt(textboxId) {
    const textbox = document.getElementById(textboxId);

    try {
        // Try using the modern clipboard API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textbox.value)
                .then(() => alert('Code copied to clipboard!'))
                .catch(() => fallbackCopyTextToClipboard(textbox.value));
                alert('Texte Copié!');
        } else {
            // Fallback if navigator.clipboard is not available
            fallbackCopyTextToClipboard(textbox.value);
            alert('Texte Copié!');
        }
    } catch (err) {
        // Fallback in case of any unexpected errors
        fallbackCopyTextToClipboard(textbox.value);
    }
}       