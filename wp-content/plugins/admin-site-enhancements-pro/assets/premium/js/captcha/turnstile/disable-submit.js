/* WP */
function turnstileWPCallback() {
    document.querySelectorAll('#wp-submit').forEach(function(el) {
        el.style.pointerEvents = 'auto';
        el.style.opacity = '1';
    });
}
function turnstileCommentCallback() {
    document.querySelectorAll('.cf-turnstile-comment').forEach(function(el) {
        el.style.pointerEvents = 'auto';
        el.style.opacity = '1';
    });
}