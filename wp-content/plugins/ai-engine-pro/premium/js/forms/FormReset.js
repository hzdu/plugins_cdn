// FormReset.js

// React & Vendor Libs
const { useRef, useState, useMemo } = wp.element;

const clearFormData = (storageKey) => {
  localStorage.removeItem(storageKey);
};

const storeEmptyData = (storageKey, debugMode) => {
  const now = Date.now();
  const data = { timestamp: now, fields: {} };
  localStorage.setItem(storageKey, JSON.stringify(data));
  if (debugMode) {
    console.log(`[${storageKey}] => Stored EMPTY form data on reset`, data);
  }
};

const errorsContainer = {
  background: '#711f1f',
  color: '#fff',
  padding: '15px 30px',
  borderRadius: '10px',
  margin: '10px 0 0 0'
};

const FormReset = (props) => {
  const { system, params } = props;
  const { debugMode } = system;
  const {
    id: systemId,
    localMemory = false,
    label = 'Reset'
  } = params;

  const [errors, setErrors] = useState([]);
  const refReset = useRef(null);

  const onResetClick = () => {
    try {
      const container = refReset.current.closest('.mwai-form-container');
      if (!container) {
        setErrors(errs => [...errs, 'Could not find parent .mwai-form-container']);
        return;
      }

      // 1) Determine localStorage key from container's ID
      const containerId = container.getAttribute('id') || 'fallback-id';
      const storageKey = `mwai-form-data-${containerId}`;

      // 2) Clear localStorage if localMemory is on
      if (localMemory) {
        clearFormData(storageKey);
        if (debugMode) {
          console.log(`[${storageKey}] => Cleared local storage on reset`);
        }
      }

      // 3) Restore each field to data-default-value
      const fieldsets = container.querySelectorAll('fieldset[data-form-name]');
      fieldsets.forEach(fieldset => {
        const subType = fieldset.getAttribute('data-form-type');
        if (subType === 'checkbox') {
          const defaultVals = (fieldset.getAttribute('data-default-value') || '').split(',');
          const checkboxes = [...fieldset.querySelectorAll('input[type="checkbox"]')];
          checkboxes.forEach(ch => {
            ch.checked = defaultVals.includes(ch.value);
          });
        }
        else if (subType === 'radio') {
          const defaultVal = fieldset.getAttribute('data-default-value') || '';
          const radios = [...fieldset.querySelectorAll('input[type="radio"]')];
          radios.forEach(r => {
            r.checked = (r.value === defaultVal);
          });
        }
        else if (subType === 'select') {
          const defaultVal = fieldset.getAttribute('data-default-value') || '';
          const select = fieldset.querySelector('select');
          if (select) {
            select.value = defaultVal;
          }
        }
        else if (subType === 'file') {
          // We can’t reliably reset file inputs
        }
        else if (subType === 'input' || subType === 'textarea') {
          const defaultVal = fieldset.getAttribute('data-default-value') || '';
          const tag = (subType === 'textarea') ? 'textarea' : 'input';
          const input = fieldset.querySelector(tag);
          if (input) {
            input.value = defaultVal;
          }
        }
      });

      // 4) Delete whatever inside .mwai-form-output divs completely. Then, let's remove the output divs themselves.
      const outputs = container.querySelectorAll('.mwai-form-output');
      outputs.forEach(output => {
        output.innerHTML = '';
        output.remove();
      });

      // 5) Optionally store empty data so that immediate reload won't re-fill
      if (localMemory) {
        storeEmptyData(storageKey, debugMode);
      }

      // 6) Dispatch an event so FormSubmit can re-scan if needed
      const resetEvent = new CustomEvent('mwaiFormReset');
      container.dispatchEvent(resetEvent);

      if (debugMode) {
        console.log(`[${storageKey}] => Fields restored to data-default-value, local storage cleared/overwritten. Dispatched mwaiFormReset event. Also cleared .mwai-form-output content.`);
      }

    } catch (err) {
      console.error('Error resetting form fields:', err);
      setErrors(e => [...e, err.message]);
    }
  };

  const baseClasses = useMemo(() => ['mwai-form-reset'], []);

  return (
    <div id={systemId} ref={refReset} className={baseClasses.join(' ')}>
      <button onClick={onResetClick}>
        <span>{label}</span>
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

export default FormReset;
