/**
 * FormUpload.js
 *
 * Renders an <input type="file"> based on the shortcode attributes.
 *
 * In your scenario, the shortcode might produce something like:
 * [mwai-form-upload
 *    id="..."
 *    label="..."
 *    name="..."
 *    accept="all-images"   <-- or "all-documents", "all", "custom"
 *    multiple="true"
 *    required="true"
 * ]
 * Or, if the user selected "custom", you'd have:
 *    accept=".png,.jpg"
 */
const { useRef, useState, useEffect, useCallback } = wp.element;

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FormUpload = (props) => {
  const { params } = props;
  const {
    id,
    label,
    type,
    name,
    required,
    className,
    accept = '',
    multiple,
    customAccept = '',
  } = params;

  const baseClass = `mwai-form-upload mwai-form-upload-${type}`;
  const classStr = `${baseClass}${className ? ` ${className}` : ''}`;
  const isRequired = required === true;
  const isMultiple = multiple === true || multiple === 'true';

  const fieldsetRef = useRef(null);
  const inputRef = useRef(null);
  const [stagedFiles, setStagedFiles] = useState([]);
  // Mirror state in a ref so the native change listener (attached once) always
  // sees the latest staged list without needing to re-bind.
  const stagedFilesRef = useRef([]);

  /**
   * Convert accept setting to a valid string for the <input> 'accept' attribute.
   */
  const resolveAcceptValue = (acceptValue, customValue) => {
    switch (acceptValue) {
    case 'all-images':
      return 'image/*';
    case 'all-documents':
      // Adjust if you'd like more file types
      return '.pdf,.doc,.docx,.txt,.xls,.xlsx';
    case 'all':
      // Return empty to accept all file types
      return '';
    case 'custom':
      // Rely on the user-provided string
      return customValue || '';
    default:
      // If the block or shortcode passes a direct string (e.g., .png,.jpg),
      // we can just return it directly
      return acceptValue;
    }
  };

  const finalAccept = resolveAcceptValue(accept, customAccept);

  // Sync the underlying <input>'s files with the staged list using DataTransfer
  // so FormSubmit can keep reading fileInput.files unchanged.
  const syncInputFiles = useCallback((files) => {
    const input = inputRef.current;
    if (!input) return;
    try {
      const dt = new DataTransfer();
      for (const f of files) dt.items.add(f);
      input.files = dt.files;
    }
    catch (e) {
      // DataTransfer.items.add is supported in all modern browsers; if it ever
      // fails we fall back silently and the user just loses the stacked file.
      console.warn('mwai-form-upload: unable to sync files via DataTransfer.', e);
    }
  }, []);

  const applyStaged = useCallback((nextFiles) => {
    stagedFilesRef.current = nextFiles;
    setStagedFiles(nextFiles);
    syncInputFiles(nextFiles);
  }, [syncInputFiles]);

  // Native 'change' listener on the input so we merge + sync BEFORE the event
  // bubbles up to the fieldset (where FormSubmit's listener reads input.files).
  // React's onChange delegates to the root, which would run AFTER FormSubmit,
  // leaving FormSubmit's cached state stale.
  useEffect(() => {
    const input = inputRef.current;
    if (!input || !isMultiple) return;
    const handler = () => {
      const picked = Array.from(input.files || []);
      const merged = [...stagedFilesRef.current];
      for (const f of picked) {
        const isDup = merged.some((m) => m.name === f.name && m.size === f.size);
        if (!isDup) merged.push(f);
      }
      applyStaged(merged);
    };
    input.addEventListener('change', handler);
    return () => input.removeEventListener('change', handler);
  }, [isMultiple, applyStaged]);

  const removeFile = useCallback((index) => {
    const next = stagedFilesRef.current.filter((_, i) => i !== index);
    applyStaged(next);
    // No native change event fires for a button click, so dispatch one so any
    // listeners on the fieldset (FormSubmit) re-read input.files.
    inputRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
  }, [applyStaged]);

  // Clear staged files when the form is reset.
  useEffect(() => {
    const container = fieldsetRef.current?.closest('.mwai-form-container');
    if (!container) return;
    const onReset = () => {
      applyStaged([]);
    };
    container.addEventListener('mwaiFormReset', onReset);
    return () => container.removeEventListener('mwaiFormReset', onReset);
  }, [applyStaged]);

  return (
    <fieldset
      ref={fieldsetRef}
      className={classStr}
      data-form-name={name}
      data-form-type="input"
      data-form-required={isRequired}
    >
      <legend>{label}</legend>
      <div className="mwai-form-upload-container">
        <input
          ref={inputRef}
          id={id}
          type="file"
          name={name}
          required={isRequired}
          accept={finalAccept}
          multiple={isMultiple}
        />
        {isMultiple && stagedFiles.length > 0 && (
          <ul
            className="mwai-form-upload-files"
            style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}
          >
            {stagedFiles.map((file, i) => (
              <li
                key={`${file.name}-${file.size}-${i}`}
                className="mwai-form-upload-file"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 0',
                  fontSize: '0.9em',
                }}
              >
                <span className="mwai-form-upload-file-name" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
                <span className="mwai-form-upload-file-size" style={{ opacity: 0.6 }}>
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  className="mwai-form-upload-file-remove"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(i)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1em',
                    padding: '0 4px',
                    lineHeight: 1,
                    color: 'inherit',
                    opacity: 0.6,
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </fieldset>
  );
};

export default FormUpload;
