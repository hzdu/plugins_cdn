'use strict';
import { createControlComponentConfig, KoStandaloneControl } from '../control-base.js';
//Note: Requires Lodash, but does not explicitly import it because this plugin
//already uses Lodash as a global variable (wsAmeLodash) in many places. Code
//that uses this component should make sure that Lodash is loaded.
let autoAssignedIdCounter = 0;
/**
 * List of visual editor buttons that are visible in the "teeny" mode.
 *
 * Found in /wp-includes/class-wp-editor.php, the editor_settings() method.
 * The relevant code is around line #601 (as of WP 6.1.1).
 */
const TeenyButtons = [
    'bold',
    'italic',
    'underline',
    'blockquote',
    'strikethrough',
    'bullist',
    'numlist',
    'alignleft',
    'aligncenter',
    'alignright',
    'undo',
    'redo',
    'link',
    'fullscreen'
];
/**
 * List of Quicktags editor buttons that are visible by default.
 *
 * The default list of text editor buttons used by wp.editor.initialize()
 * doesn't match the defaults used by wp_editor() in PHP. Let's copy the list
 * from /includes/class-wp-editor.php.
 */
const DefaultQuicktagsButtons = [
    'strong', 'em', 'link', 'block', 'del', 'ins', 'img', 'ul', 'ol', 'li', 'code', 'more', 'close'
];
class AmeWpEditor extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.editorId = null;
        this.isWpEditorInitialized = false;
        const textSetting = this.settings.value;
        if (typeof textSetting === 'undefined') {
            throw new Error('Visual Editor control is missing the required setting');
        }
        this.rows = params.rows || 6;
        this.isTeeny = !!params.teeny;
    }
    getAdditionalInputAttributes() {
        return Object.assign({ rows: this.rows.toString() }, super.getAdditionalInputAttributes());
    }
    koDescendantsComplete() {
        const $textArea = this.findChild('textarea.ame-wp-editor-textarea');
        if ($textArea.length === 0) {
            return;
        }
        const currentValue = this.valueProxy();
        $textArea.val((currentValue === null) ? '' : currentValue.toString());
        //The textarea must have an ID for wp.editor.initialize() to work.
        {
            let editorId = $textArea.attr('id');
            if (!editorId) {
                editorId = 'ws-ame-wp-editor-aid-' + (autoAssignedIdCounter++);
                $textArea.attr('id', editorId);
            }
            this.editorId = editorId;
        }
        //Update the setting when the contents of the underlying textarea change.
        //This happens when the user selects the "Text" tab in the editor, or when
        //TinyMCE is unavailable (e.g. if the "Disable the visual editor when writing"
        //option is checked in the user's profile).
        $textArea.on('change input', this.throttleUpdates(() => $textArea.val()));
        let editorSettings = {
            tinymce: {
                wpautop: true
            },
            quicktags: {
                //The default list of text editor buttons used by wp.editor.initialize()
                //doesn't match the defaults used by wp_editor() in PHP. Let's copy the list
                //from /includes/class-wp-editor.php.
                buttons: DefaultQuicktagsButtons.join(','),
            },
            //Include the "Add Media" button.
            mediaButtons: true,
        };
        if (typeof window['tinymce'] === 'undefined') {
            //TinyMCE is disabled or not available.
            editorSettings.tinymce = false;
        }
        if (this.isTeeny && (typeof editorSettings.tinymce === 'object')) {
            editorSettings.tinymce.toolbar1 = TeenyButtons.join(',');
            editorSettings.tinymce.toolbar2 = '';
        }
        const $document = jQuery(document);
        const self = this;
        //After the editor finishes initializing, add an event listener to update
        //the setting when the contents of the visual editor change.
        $document.on('tinymce-editor-init', function addMceChangeListener(event, editor) {
            if (editor.id !== self.editorId) {
                return; //Not our editor.
            }
            //According to the TinyMCE documentation, the "Change" event is fired
            //when "changes [...] cause an undo level to be added". This could be
            //too frequent for our purposes, so we'll throttle the callback.
            editor.on('Change', self.throttleUpdates(() => editor.getContent()));
            $document.off('tinymce-editor-init', addMceChangeListener);
        });
        //Unfortunately, as of WP 6.2-beta, wp.editor.initialize() doesn't add
        //the "wp-editor-container" wrapper when only the Quicktags editor is used.
        //This means the editor won't be styled correctly. Let's fix that.
        $document.on('quicktags-init', function maybeAddEditorWrapper(event, editor) {
            if (!editor || (editor.id !== self.editorId)) {
                return;
            }
            if (editor.canvas) {
                const $textarea = jQuery(editor.canvas);
                const $wrapper = $textarea.closest('.wp-editor-container');
                if ($wrapper.length === 0) {
                    //Also include the toolbar in the wrapper.
                    const $toolbar = $textarea.prevAll('.quicktags-toolbar').first();
                    $textarea.add($toolbar).wrapAll('<div class="wp-editor-container"></div>');
                }
            }
            $document.off('quicktags-init', maybeAddEditorWrapper);
        });
        //Finally, initialize the editor.
        wp.editor.initialize($textArea.attr('id'), editorSettings);
        this.isWpEditorInitialized = true;
    }
    /**
     * Create a throttled function that updates the setting.
     *
     * There are multiple ways to get the contents of the editor (e.g. TinyMCE mode
     * vs a plain textarea), so using a utility function helps avoid code duplication.
     *
     * @param valueGetter
     * @protected
     */
    throttleUpdates(valueGetter) {
        const textSetting = this.settings.value;
        return wsAmeLodash.throttle(function () {
            textSetting.value(valueGetter());
            return void 0;
        }, 1000, { leading: true, trailing: true });
    }
    dispose() {
        //Destroy the editor. It's not clear whether this is necessary, but it's
        //probably a good idea to give WP a chance to clean up.
        if (this.isWpEditorInitialized && (this.editorId !== null)) {
            wp.editor.remove(this.editorId);
            this.isWpEditorInitialized = false;
        }
        super.dispose();
    }
}
//Note: The class of the textarea element is set directly instead of using a binding
//because it must always have the "wp-editor-area" class for it to render correctly
//(apparently, wp.editor.initialize() does not automatically add that class).
//Knockout should not be able to remove the class.
export default createControlComponentConfig(AmeWpEditor, `
	<textarea data-bind="attr: inputAttributes" class="wp-editor-area ame-wp-editor-textarea" cols="40"></textarea>	
`);
//# sourceMappingURL=ame-wp-editor.js.map