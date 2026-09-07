/**
 * CodeMirror Integration for File Manager
 *
 * @package ASENHA\FileManager
 */

(function($) {
	'use strict';

	/**
	 * CodeMirror Integration Object
	 */
	window.AsenhafmCodeMirror = {
		editor: null,
		editorInstance: null,

		/**
		 * Initialize CodeMirror using WordPress Code Editor
		 */
		init(textarea, options = {}) {
			if (typeof wp === 'undefined' || typeof wp.codeEditor === 'undefined') {
				console.warn('WordPress Code Editor not loaded. Using plain textarea.');
				return null;
			}

			// Determine file extension/mode
			const filePath = textarea.data('file-path') || '';
			const extension = filePath.split('.').pop().toLowerCase();
			const mimeType = this.getMimeType(extension);

			// WordPress code editor settings
			const editorSettings = {
				codemirror: {
					mode: mimeType,
					lineNumbers: true,
					lineWrapping: true,
					indentUnit: 4,
					indentWithTabs: true,
					matchBrackets: true,
					autoCloseBrackets: true,
					styleActiveLine: true,
					extraKeys: {
						'Ctrl-S': (cm) => this.saveFile(cm),
						'Cmd-S': (cm) => this.saveFile(cm),
						'Ctrl-F': 'findPersistent',
						'Cmd-F': 'findPersistent',
						'Ctrl-G': 'findNext',
						'Cmd-G': 'findNext',
						'Shift-Ctrl-G': 'findPrev',
						'Shift-Cmd-G': 'findPrev',
						'Shift-Ctrl-F': 'replace',
						'Shift-Cmd-F': 'replace',
						'Shift-Ctrl-R': 'replaceAll',
						'Shift-Cmd-R': 'replaceAll'
					},
					// Merge custom options
					...options
				}
			};

		// Initialize WordPress code editor
		this.editorInstance = wp.codeEditor.initialize(textarea[0], editorSettings);
		
		if (this.editorInstance) {
			this.editor = this.editorInstance.codemirror;
			
			// Set size to fill the modal body
			// Use a fixed height so empty files still show full editor
			const modalBody = textarea.closest('.asenha-fm-modal-body');
			const editorHeight = modalBody.length ? modalBody.height() : 600;
			this.editor.setSize('100%', editorHeight + 'px');

			// Focus editor
			setTimeout(() => {
				this.editor.refresh();
				this.editor.focus();
			}, 100);
			
			return this.editor;
		}
			
			return null;
		},

		/**
		 * Get MIME type for file extension
		 */
		getMimeType(extension) {
			const mimeTypeMap = {
				'php': 'application/x-httpd-php',
				'js': 'text/javascript',
				'json': 'application/json',
				'css': 'text/css',
				'scss': 'text/x-scss',
				'less': 'text/x-less',
				'html': 'text/html',
				'htm': 'text/html',
				'xml': 'application/xml',
				'svg': 'image/svg+xml',
				'md': 'text/x-markdown',
				'txt': 'text/plain',
				'sql': 'application/x-sql',
				'py': 'text/x-python',
				'rb': 'text/x-ruby',
				'java': 'text/x-java',
				'c': 'text/x-csrc',
				'cpp': 'text/x-c++src',
				'cs': 'text/x-csharp',
				'sh': 'application/x-sh',
				'yml': 'text/x-yaml',
				'yaml': 'text/x-yaml'
			};

			return mimeTypeMap[extension] || 'text/plain';
		},

	/**
	 * Get editor value
	 */
		getValue() {
			if (!this.editor) {
				return $('#asenha-fm-editor-textarea').val();
			}
			return this.editor.getValue();
		},

		/**
		 * Set editor value
		 */
		setValue(value) {
			if (!this.editor) {
				$('#asenha-fm-editor-textarea').val(value);
				return;
			}
			this.editor.setValue(value);
		},

		/**
		 * Destroy editor instance
		 */
		destroy() {
			if (this.editor) {
				this.editor.toTextArea();
				this.editor = null;
			}
			if (this.editorInstance) {
				this.editorInstance = null;
			}
		},

		/**
		 * Save file (called from keyboard shortcut)
		 */
		saveFile(cm = null) {
			// Do nothing in read-only mode.
			const editor = cm || this.editor;
			if (editor && editor.getOption && editor.getOption('readOnly')) {
				return false;
			}

			// Do nothing if Save button is not available (hidden/disabled).
			const $saveBtn = $('#asenha-fm-editor-save');
			if (!$saveBtn.length || !$saveBtn.is(':visible') || $saveBtn.prop('disabled')) {
				return false;
			}

			$saveBtn.trigger('click');
			return false;
		},

		/**
		 * Refresh editor
		 */
		refresh() {
			if (this.editor) {
				this.editor.refresh();
			}
		}
	};

	// CodeMirror is now initialized explicitly from the file manager's openFile function
	// This ensures proper initialization with the correct file content and mode

})(jQuery);

