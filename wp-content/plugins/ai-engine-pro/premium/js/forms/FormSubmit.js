// FormSubmit.js

// React & WP Vendor Libs
const { render, useEffect, useRef, useState, useMemo } = wp.element;

// AI Engine (adjust imports as needed)
import { mwaiHandleRes, mwaiFetch, mwaiFetchUpload } from '@app/helpers';
import { OutputHandler } from '@app/helpers';
import { mwaiAPI, applyFilters } from '@app/chatbot/MwaiAPI';
import { useChrono } from '@app/chatbot/helpers';
import tokenManager from '@app/helpers/tokenManager';

/**
 * Inline style for error container
 */
const errorsContainer = {
  background: '#711f1f',
  color: '#fff',
  padding: '15px 30px',
  borderRadius: '10px',
  margin: '10px 0 0 0',
};

/* -------------------------------------------------------------------------
   Local Helpers
------------------------------------------------------------------------- */
const storeFormData = (storageKey, fields, debugMode) => {
  try {
    const now = Date.now();
    const data = { timestamp: now, fields };
    localStorage.setItem(storageKey, JSON.stringify(data));
    if (debugMode) {
      // console.log(`[${storageKey}] => Stored form data`, data);
    }
  } catch (err) {
    console.warn('Could not store form data in localStorage', err);
  }
};

const loadFormData = (storageKey, maxAgeHours = 12, debugMode) => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      if (debugMode) {
        // console.log(`[${storageKey}] => No form data found in localStorage`);
      }
      return null;
    }
    const data = JSON.parse(stored);
    const now = Date.now();
    if (now - data.timestamp > maxAgeHours * 60 * 60 * 1000) {
      localStorage.removeItem(storageKey);
      if (debugMode) {
        // console.log(`[${storageKey}] => Form data in localStorage is expired`);
      }
      return null;
    }
    if (debugMode) {
      // console.log(`[${storageKey}] => Loaded form data`, data);
    }
    return data.fields;
  } catch (err) {
    console.warn(`[${storageKey}] => Could not load form data from localStorage`, err);
    return null;
  }
};

const clearFormData = (storageKey) => {
  localStorage.removeItem(storageKey);
};

const applyValueToDOM = (inputEl, rawVal) => {
  const { subType, element } = inputEl;
  if (subType === 'checkbox') {
    const arr = Array.isArray(rawVal) ? rawVal : rawVal ? [rawVal] : [];
    const checkboxes = [...element.querySelectorAll('input[type="checkbox"]')];
    checkboxes.forEach((ch) => {
      ch.checked = arr.includes(ch.value);
    });
    return arr;
  }
  if (subType === 'radio') {
    const radios = [...element.querySelectorAll('input[type="radio"]')];
    radios.forEach((r) => {
      r.checked = r.value === rawVal;
    });
    return rawVal || null;
  }
  if (subType === 'select') {
    const select = element.querySelector('select');
    if (select) {
      select.value = String(rawVal || '');
    }
    return rawVal || '';
  }
  if (subType === 'file') {
    // We cannot set file inputs programmatically
    return [];
  }
  if (subType === 'input' || subType === 'textarea') {
    const tag = subType === 'textarea' ? 'textarea' : 'input';
    const field = element.matches(tag) ? element : element.querySelector(tag);
    if (field) {
      field.value = String(rawVal || '');
    }
    return rawVal || '';
  }
  // fallback for "element" or other
  if (subType === 'element') {
    element.textContent = String(rawVal || '');
    return String(rawVal || '');
  }
  // fallback
  return rawVal;
};

const isElementHidden = (el) => {
  let current = el;
  while (current) {
    if (current.hidden) return true;
    const style = window.getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return true;
    }
    current = current.parentElement;
  }
  return false;
};

const isFieldValid = (inputElement, value) => {
  if (isElementHidden(inputElement.element)) return true;
  if (!inputElement.required) return true;
  // For checkboxes (arrays), valid if length > 0
  return !!value && (Array.isArray(value) ? value.length > 0 : true);
};

const getValue = (inputElement) => {
  const { subType, element } = inputElement;
  let newVal = null;

  if (subType === 'checkbox') {
    const checkboxes = [...element.querySelectorAll('input[type="checkbox"]')];
    newVal = checkboxes.filter((ch) => ch.checked).map((ch) => ch.value);
  } else if (subType === 'radio') {
    const radios = [...element.querySelectorAll('input[type="radio"]')];
    const radio = radios.find((r) => r.checked);
    newVal = radio ? radio.value : null;
  } else if (subType === 'select') {
    const select = element.querySelector('select');
    newVal = select ? select.value : '';
  } else if (subType === 'file') {
    const fileInput = element.querySelector('input[type="file"]');
    if (!fileInput) {
      newVal = [];
    } else if (fileInput.hasAttribute('multiple')) {
      newVal = Array.from(fileInput.files || []);
    } else {
      newVal = fileInput.files.length > 0 ? [fileInput.files[0]] : [];
    }
  } else if (subType === 'input' || subType === 'textarea') {
    const tag = subType === 'textarea' ? 'textarea' : 'input';
    const input = element.matches(tag) ? element : element.querySelector(tag);
    newVal = input ? input.value : '';
  } else if (subType === 'element') {
    newVal = element.textContent.trim() || element.value || '';
  } else {
    // Possibly a plain element with text
    newVal = element.textContent.trim() || element.value || '';
  }
  return newVal;
};

/* -------------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------------- */
const FormSubmit = (props) => {
  const { system, params } = props;

  // System-based config
  const {
    id,
    stream = false,
    sessionId,
    contextId,
    restNonce: initialRestNonce,
    restUrl,
    debugMode,
  } = system;
  
  // State for REST nonce to handle token refresh
  const [restNonce, setRestNonce] = useState(initialRestNonce || tokenManager.getToken());
  const restNonceRef = useRef(initialRestNonce || tokenManager.getToken());

  // Subscribe to global token updates
  useEffect(() => {
    const unsubscribe = tokenManager.subscribe((newToken) => {
      setRestNonce(newToken);
      restNonceRef.current = newToken;
    });
    return unsubscribe;
  }, []);

  // Params-based config
  const {
    id: systemId,
    localMemory = false,
    label,
    outputElement,
    inputs,
  } = params;

  // React states
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  // Same elapsed-time counter the chatbot shows while it waits for the reply.
  // Forms can be slower than chats (long generations, file uploads), so the
  // feedback matters even more here. Driven off isLoading rather than the
  // individual request paths, so every one of them gets it.
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  useEffect(() => {
    if (isLoading) {
      startChrono();
    }
    else {
      stopChrono();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  const [fields, setFields] = useState({});
  const [serverReply, setServerReply] = useState();
  const [errors, setErrors] = useState([]);

  // Keep track of MutationObservers for "element" subTypes, so we can clean up if needed
  const observersRef = useRef([]);
  const inputElementsRef = useRef([]);

  const refSubmit = useRef(null);

  /* ---------------------------------------------------------------------
     1) Register/Expose this form to mwaiAPI
  --------------------------------------------------------------------- */
  // Set one field by name/selector. Writes to the live DOM (so the user sees
  // the value) and to React state (so submit, validation, and localMemory see
  // it too). Returns true if the field was found, false otherwise.
  const setField = (name, value) => {
    const inputEl = inputElementsRef.current.find(
      (ie) => (ie.field ?? ie.selector) === name
    );
    if (!inputEl) {
      if (debugMode) console.warn(`[mwaiAPI.setField] field "${name}" not found`);
      return false;
    }
    const finalValue = applyValueToDOM(inputEl, value);
    setFields((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: finalValue,
        isValid: isFieldValid(inputEl, finalValue),
      },
    }));
    return true;
  };

  useEffect(() => {
    if (!systemId) return;

    const formObj = {
      formId: systemId,
      getFields: () => fields,
      setField,
      // Batch helper: prefill({ name: 'Jordy', email: '…' }). Returns an object
      // listing which fields were set vs. unknown, so callers can spot typos.
      prefill: (values) => {
        const set = [];
        const missing = [];
        for (const [k, v] of Object.entries(values || {})) {
          (setField(k, v) ? set : missing).push(k);
        }
        return { set, missing };
      },
      submit: () => onSubmitClick(),
    };

    const existingIndex = mwaiAPI.forms.findIndex((f) => f.formId === systemId);
    if (existingIndex !== -1) {
      mwaiAPI.forms[existingIndex] = formObj;
    } else {
      mwaiAPI.forms.push(formObj);
    }
  }, [systemId, fields]);

  /* ---------------------------------------------------------------------
     2) onInputElementChanged => compare old vs new, update state
  --------------------------------------------------------------------- */
  const onInputElementChanged = (inputElement) => {
    const key = inputElement.field ?? inputElement.selector;
    const currentVal = fields[key]?.value ?? null;
    const newVal = getValue(inputElement);

    if (JSON.stringify(currentVal) !== JSON.stringify(newVal)) {
      if (debugMode) {
        console.log(
          `[${key}] => Value updated from "${currentVal}" to "${newVal}"`
        );
      }
      setFields((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: newVal,
          isValid: isFieldValid(inputElement, newVal),
        },
      }));
    }
  };

  // Helper to attach event listeners to an element
  const attachListeners = (inputEl) => {
    const key = inputEl.field ?? inputEl.selector;
    const updateValidity = () => {
      setFields((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isValid: isFieldValid(inputEl, prev[key]?.value),
        },
      }));
    };
    // For text-like form elements, we rely on 'change'/'keyup'
    if (
      inputEl.subType !== 'element' &&
      inputEl.subType !== 'autodetected-element'
    ) {
      inputEl.element.addEventListener('change', () =>
        onInputElementChanged(inputEl)
      );
      inputEl.element.addEventListener('keyup', () =>
        onInputElementChanged(inputEl)
      );
      const attrObserver = new MutationObserver(updateValidity);
      attrObserver.observe(inputEl.element, {
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden'],
        subtree: false,
      });
      observersRef.current.push(attrObserver);
      return;
    }

    // For a plain "element" (e.g. <div>), we use a MutationObserver
    if (debugMode) {
      console.log(
        `[${inputEl.field || inputEl.selector}] => Setting up MutationObserver`
      );
    }
    const observer = new MutationObserver((mutationsList) => {
      // We'll just call onInputElementChanged once per "batch" of changes
      onInputElementChanged(inputEl);
    });

    observer.observe(inputEl.element, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    observersRef.current.push(observer);

    const attrObserver = new MutationObserver(updateValidity);
    attrObserver.observe(inputEl.element, {
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
      subtree: false,
    });
    observersRef.current.push(attrObserver);
  };

  // Revalidate all fields, used when visibility changes
  const revalidateAll = () => {
    setFields((prev) => {
      const updated = { ...prev };
      inputElementsRef.current.forEach((inputEl) => {
        const key = inputEl.field ?? inputEl.selector;
        if (updated[key]) {
          updated[key].isValid = isFieldValid(inputEl, updated[key].value);
        }
      });
      return updated;
    });
  };

  // Clean up observers if the component unmounts
  useEffect(() => {
    return () => {
      if (debugMode && observersRef.current.length > 0) {
        console.log('Disconnecting all MutationObservers...');
      }
      observersRef.current.forEach((obs) => obs.disconnect());
      observersRef.current = [];
    };
  }, [debugMode]);

  // Main init
  const handlePageLoad = () => {
    const container = refSubmit.current?.closest('.mwai-form-container');
    if (!container) {
      setErrors((errs) => [...errs, 'Cannot find parent .mwai-form-container']);
      return;
    }

    const containerId = container.getAttribute('id') || 'fallback-id';
    const storageKey = `mwai-form-data-${containerId}`;

    let savedData = null;
    if (localMemory) {
      savedData = loadFormData(storageKey, 12, debugMode);
    }

    // Gather "prompt-defined" inputs
    const inputElements = [];

    // A) .selectors
    inputs?.selectors?.forEach((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        setErrors((errs) => [...errs, `Input (selector) not found: ${selector}`]);
        return;
      }
      const required = element.getAttribute('data-form-required') === 'true';
      let subType = element.getAttribute('data-form-type');

      if (!subType) {
        const tagName = (element.tagName || '').toLowerCase();
        if (tagName === 'input') subType = 'input';
        else if (tagName === 'textarea') subType = 'textarea';
        else if (tagName === 'select') subType = 'select';
        else subType = 'element';
      }

      inputElements.push({
        selector,
        subType,
        element,
        required,
        type: 'selector',
      });
    });

    // B) .fields
    inputs?.fields?.forEach((fieldName) => {
      const fieldset = container.querySelector(
        `fieldset[data-form-name='${fieldName}']`
      );
      if (!fieldset) {
        setErrors((errs) => [...errs, `Field not found: ${fieldName}`]);
        return;
      }

      let subType = fieldset.getAttribute('data-form-type') || 'input';
      const required = fieldset.getAttribute('data-form-required') === 'true';

      const fileInput = fieldset.querySelector('input[type="file"]');
      if (fileInput) {
        subType = 'file';
      }

      inputElements.push({
        field: fieldName,
        subType,
        element: fieldset,
        required,
        type: 'field',
      });
    });

    // C) Leftover required elements not listed in .fields or .selectors
    const leftoverRequiredEls = container.querySelectorAll(
      '[data-form-required="true"]'
    );
    leftoverRequiredEls.forEach((el) => {
      // Skip if already in inputElements
      const alreadyPresent = inputElements.some(
        (inputEl) => inputEl.element === el
      );
      if (alreadyPresent) return;

      let subType = el.getAttribute('data-form-type');
      if (!subType) {
        const tagName = el.tagName.toLowerCase();
        if (tagName === 'input') {
          const t = el.getAttribute('type');
          if (t === 'checkbox') subType = 'checkbox';
          else if (t === 'radio') subType = 'radio';
          else subType = 'input';
        } else if (tagName === 'textarea') {
          subType = 'textarea';
        } else if (tagName === 'select') {
          subType = 'select';
        } else {
          subType = 'element';
        }
      }

      // We need a key for fields
      // For leftover items, we can attempt name/id, or fallback:
      const autoKey =
        el.getAttribute('name') ||
        el.getAttribute('id') ||
        `autodetected-${Math.random()}`;

      inputElements.push({
        field: autoKey,
        subType,
        element: el,
        required: true,
        type: 'autodetected',
      });
    });

    // Now we initialize them all
    const freshFields = {};

    inputElements.forEach((inputEl) => {
      const key = inputEl.field ?? inputEl.selector;
      const { subType, element, type, required } = inputEl;

      // For "selector" or "field", we do the old approach (local memory, default values, etc.)
      // For "autodetected", we do NOT want to overwrite the existing DOM value,
      // so we simply read the DOM as-is.
      let finalValue;

      if (type === 'autodetected') {
        // Just read the current DOM, no local memory or default
        finalValue = getValue(inputEl);
      } else {
        // Possibly load from saved data
        const canUseMemory = localMemory && type !== 'selector';
        const savedValue = canUseMemory ? savedData?.[key]?.value : undefined;

        if (typeof savedValue !== 'undefined') {
          finalValue = applyValueToDOM(inputEl, savedValue);
        } else {
          // Instead of defaulting to an empty string, only use data-default-value if it exists
          if (element.hasAttribute('data-default-value')) {
            const defVal = element.getAttribute('data-default-value');
            finalValue = applyValueToDOM(inputEl, defVal);
          } else {
            // fallback to the actual DOM value
            finalValue = getValue(inputEl);
          }
        }

        // If radio or select with empty value => pick first option
        if ((subType === 'radio' || subType === 'select') && !finalValue) {
          if (subType === 'radio') {
            const radios = [...element.querySelectorAll('input[type="radio"]')];
            if (radios.length > 0) {
              finalValue = applyValueToDOM(inputEl, radios[0].value);
            }
          } else if (subType === 'select') {
            const select = element.querySelector('select');
            if (select && select.options.length > 0) {
              finalValue = applyValueToDOM(inputEl, select.options[0].value);
            }
          }
        }

        if (subType === 'element') {
          // Just confirm finalValue is from element
          finalValue = element.textContent.trim() || element.value || '';
        }
      }

      // Create the field in state
      freshFields[key] = {
        value: finalValue,
        subType,
        isRequired: required,
        isValid: isFieldValid(inputEl, finalValue),
        type,
      };
    });

    // Put it in state
    setFields(freshFields);

    // If localMemory => store relevant items
    if (localMemory) {
      const fieldsToStore = {};
      for (const [k, v] of Object.entries(freshFields)) {
        if (v.type === 'field') {
          fieldsToStore[k] = v;
        }
      }
      storeFormData(storageKey, fieldsToStore, debugMode);
    }

    // Attach event listeners / observers
    inputElements.forEach(attachListeners);

    // Store reference for revalidation later
    inputElementsRef.current = inputElements;
  };

  /* ---------------------------------------------------------------------
     3) On Mount => handlePageLoad
  --------------------------------------------------------------------- */
  useEffect(() => {
    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
    }
    return () => {
      window.removeEventListener('load', handlePageLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  /* ---------------------------------------------------------------------
     4) Whenever fields change => re-validate
  --------------------------------------------------------------------- */
  useEffect(() => {
    // If no fields, assume form is valid
    if (!Object.keys(fields).length) {
      setIsValid(true);
      return;
    }

    const allValid = Object.values(fields).every((f) => f.isValid);
    setIsValid(allValid);

    // If localMemory => store again
    const container = refSubmit.current?.closest('.mwai-form-container');
    if (container && localMemory) {
      const containerId = container.getAttribute('id') || 'fallback-id';
      const storageKey = `mwai-form-data-${containerId}`;
      // store only "fields" (not autodetected) to avoid overwriting
      const fieldsToStore = {};
      for (const [k, v] of Object.entries(fields)) {
        if (v.type === 'field') {
          fieldsToStore[k] = v;
        }
      }
      storeFormData(storageKey, fieldsToStore, debugMode);
    }
  }, [fields]);

  /* ---------------------------------------------------------------------
     5) Watch for external "mwaiFormReset" event
  --------------------------------------------------------------------- */
  useEffect(() => {
    const container = refSubmit.current?.closest('.mwai-form-container');
    if (!container) return;

    const onReset = () => {
      // Re-run handlePageLoad => restore defaults
      handlePageLoad();
    };

    container.addEventListener('mwaiFormReset', onReset);
    return () => {
      container.removeEventListener('mwaiFormReset', onReset);
    };
  }, []);

  /* ---------------------------------------------------------------------
     6) Watch for conditional visibility changes
  --------------------------------------------------------------------- */
  useEffect(() => {
    const container = refSubmit.current?.closest('.mwai-form-container');
    if (!container) return;

    const onToggle = () => {
      revalidateAll();
    };

    container.addEventListener('mwaiConditionalToggle', onToggle);
    return () => {
      container.removeEventListener('mwaiConditionalToggle', onToggle);
    };
  }, []);

  /* ---------------------------------------------------------------------
     7) Upload file helper
  --------------------------------------------------------------------- */
  const uploadFile = async (file) => {
    if (!file) return null;
    const url = `${restUrl}/mwai-ui/v1/files/upload`;

    // All user uploads are for analysis - let the backend determine handling by MIME type
    const mimeType = file.type || 'application/octet-stream';
    let purpose = 'analysis';

    const res = await mwaiFetchUpload(
      url,
      file,
      restNonce,
      (progress) => {
        if (debugMode) {
          console.log(`Uploading "${file.name}" => ${progress}%`);
        }
      },
      { type: mimeType, purpose: purpose }
    );

    if (!res || !res.success) {
      throw new Error(res?.message || 'File upload failed.');
    }
    return res.data;
  };

  /* ---------------------------------------------------------------------
     7) onSubmit => gather fields, upload files, send to server
  --------------------------------------------------------------------- */
  const onSubmitClick = async () => {
    setIsLoading(true);
    setServerReply({ success: true, reply: '' });
    setErrors([]);

    try {
      const finalFields = { ...fields };
      const dataFields = {};
      const dataUploadFields = {};

      // Identify file fields
      const fileKeys = Object.keys(finalFields).filter(
        (k) => finalFields[k].subType === 'file'
      );

      // 1) Upload each file array
      for (const key of fileKeys) {
        const fileArr = finalFields[key].value || [];
        const uploadedData = [];
        for (const file of fileArr) {
          if (file instanceof File) {
            const uploaded = await uploadFile(file);
            uploadedData.push(uploaded);
          } else {
            uploadedData.push(file);
          }
        }
        dataUploadFields[key] = uploadedData;
      }

      // 2) Non-file fields
      Object.keys(finalFields).forEach((k) => {
        if (!fileKeys.includes(k)) {
          dataFields[k] = finalFields[k].value;
        }
      });

      // 3) Build final body
      const body = {
        id,
        session: sessionId,
        contextId,
        stream,
        fields: dataFields,
        uploadFields: dataUploadFields,
      };
      if (debugMode) {
        console.log('[FORMS] OUT:', body);
      }

      // Handler for token updates
      const handleTokenUpdate = (newToken) => {
        setRestNonce(newToken);
        restNonceRef.current = newToken;
        tokenManager.setToken(newToken); // Update globally
      };
      
      // 4) Send to server
      const res = await mwaiFetch(
        `${restUrl}/mwai-ui/v1/forms/submit`,
        body,
        restNonceRef.current,
        stream,
        undefined,
        handleTokenUpdate
      );
      const data = await mwaiHandleRes(
        res,
        stream ? (content, streamData) => {
          // Debug enhanced streaming data
          if (debugMode && streamData && streamData.subtype) {
            console.log('[FORMS] STREAM EVENT:', streamData);
          }
          setServerReply({ success: true, reply: content });
        } : null,
        debugMode ? 'FORMS' : null,
        handleTokenUpdate,
        debugMode
      );
      setServerReply(data);

      if (debugMode) {
        console.log('[FORMS] IN:', data);
      }

      // 5) If success => clear localMemory
      if (data.success && localMemory) {
        const container = refSubmit.current?.closest('.mwai-form-container');
        if (container) {
          const containerId = container.getAttribute('id') || 'fallback-id';
          const storageKey = `mwai-form-data-${containerId}`;
          clearFormData(storageKey);
        }
      }
    } catch (err) {
      console.error('An error occurred during form submission:', err);
      setErrors((e) => [...e, err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------------------------------
     8) Show serverReply in output area
  --------------------------------------------------------------------- */
  useEffect(() => {
    if (!serverReply) return;
    if (!outputElement) return; // Skip if no output element specified

    const output = document.querySelector(outputElement);
    if (!output) {
      const msg = `Output not found: ${outputElement || 'N/A'}`;
      setErrors((errs) => (errs.includes(msg) ? errs : [...errs, msg]));
      return;
    }

    const { success, reply, message } = serverReply;
    const isStreaming = isLoading && stream;
    const shouldApplyReplyFilters = success && !isLoading;
    const finalReply = shouldApplyReplyFilters ? applyFilters('ai.formReply', reply, {
      formId: id,
      sessionId,
      contextId,
    }) : reply;

    if (output.tagName === 'INPUT' || output.tagName === 'TEXTAREA') {
      output.value = finalReply || '';
      return;
    }

    if (success) {
      render(
        <OutputHandler
          baseClass="mwai-form-output"
          content={finalReply}
          isStreaming={isStreaming}
        />,
        output
      );
    } else {
      render(
        <OutputHandler
          baseClass="mwai-form-output"
          error={message}
          isStreaming={isStreaming}
        />,
        output
      );
    }
  }, [isLoading, stream, serverReply, outputElement, id, sessionId, contextId]);

  /* ---------------------------------------------------------------------
     9) Render the component
  --------------------------------------------------------------------- */
  const baseClasses = useMemo(() => {
    const classes = ['mwai-form-submit'];
    if (isLoading) classes.push('mwai-loading');
    return classes;
  }, [isLoading]);

  return (
    <div id={systemId} ref={refSubmit} className={baseClasses.join(' ')}>
      <button disabled={!isValid || isLoading} onClick={onSubmitClick}>
        <span>{label}</span>
        {isLoading && timeElapsed && <div className="mwai-timer">{timeElapsed}</div>}
      </button>

      {errors.length > 0 && (
        <ul className="mwai-forms-errors" style={errorsContainer}>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormSubmit;
