wpDiscuzEditor.addButtonEventHandler('sticker', wpdemSticker);

function wpdemSticker(editor, uniqueID) {
    var wpdemEditorWraper = document.getElementById('wpd-editor-wraper-' + uniqueID);
    var wpdemCurrentRange = editor.getSelection();
    var wpdemStickerContainer = wpdemEditorWraper.querySelector('#wpdem-sticker-container-' + uniqueID);
    if (wpdemCurrentRange !== null) {
        editor.setSelection(wpdemCurrentRange.index);
    }
    if (wpdemStickerContainer === null) {
        var wpdemStickerContainer = document.createElement('div');
        wpdemStickerContainer.setAttribute('id', 'wpdem-sticker-container-' + uniqueID);
        var wpdemStickersHtml = document.getElementById('wpdem-sticker-contaniner-main').innerHTML;
        wpdemStickerContainer.innerHTML = wpdemStickersHtml;
        wpdemEditorWraper.appendChild(wpdemStickerContainer);
        var stickers = wpdemStickerContainer.querySelectorAll('.wpdem-sticker-body > img.wpdem-editor-sticker');
        stickers.forEach((sticker) => {
            sticker.addEventListener('mousedown', (event) => {
                sticker = event.target;
                var data = {name: sticker.alt, path: sticker.src};
                var range = editor.getSelection();
                if (range !== null) {
                    editor.insertEmbed(range.index, 'sticker', data, Quill.sources.USER);
                    editor.setSelection(range.index + 1);
                }
            });
        });
        wpdemStickerContainer.classList.add('wpdem-sticker-container');
    }
    document.querySelector('#wpd-main-form-wrapper-' + uniqueID + ' .wpd_comm_form, #wpd-secondary-form-wrapper-' + uniqueID + ' .wpd_comm_form').addEventListener('submit', function () {
        wpdemStickerContainer.classList.remove('wpdem-sticker-open');
    });
    wpdemStickerContainer.classList.toggle('wpdem-sticker-open');
}
