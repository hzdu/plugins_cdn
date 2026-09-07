const { useEffect } = wp.element;

const FormConditional = (props) => {
  const { system, params } = props;
  const { debugMode } = system;
  let { id, conditions = [], logic = 'AND', conditionField, conditionValue } = params;
  if ( !conditions.length && conditionField ) {
    conditions = [ { field: conditionField, operator: 'eq', value: conditionValue } ];
  }
  if ( typeof conditions === 'string' ) {
    try { conditions = JSON.parse(decodeURIComponent(conditions)); }
    catch (e) { conditions = []; }
  }


  useEffect( () => {
    const container = document.getElementById(`mwai-form-conditional-${id}`);
    if ( !container ) return;
    const form = container.closest('.mwai-form-container');
    if ( !form ) return;

    const getValues = (fieldset) => {
      const inputs = fieldset.querySelectorAll('input, textarea, select');
      if ( !inputs.length ) return [];
      const first = inputs[0];
      switch (first.type) {
      case 'radio': {
        const checked = fieldset.querySelector('input[type="radio"]:checked');
        return checked ? [ checked.value ] : [];
      }
      case 'checkbox':
        return Array.from(fieldset.querySelectorAll('input[type="checkbox"]:checked'), el => el.value);
      default:
        return [ first.value ];
      }
    };

    const evaluate = () => {
      const results = conditions.map(cond => {
        const fieldset = form.querySelector(`fieldset[data-form-name='${cond.field}']`);
        if ( !fieldset ) return false;
        const values = getValues(fieldset).map(v => String(v));
        const target = String(cond.value ?? '');
        switch (cond.operator) {
        case 'eq':
          return values.some(v => v === target);
        case 'neq':
          return values.every(v => v !== target);
        case 'contains':
          return values.some(v => v.includes(target));
        case 'not_contains':
          return values.every(v => !v.includes(target));
        case 'empty':
          return values.every(v => !v);
        case 'not_empty':
          return values.some(v => v);
        default:
          return false;
        }
      });
      const shouldShow = logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
      container.style.display = shouldShow ? '' : 'none';
      container.dispatchEvent(
        new CustomEvent('mwaiConditionalToggle', {
          bubbles: true,
          detail: { visible: shouldShow },
        })
      );
      if (debugMode) {
        console.log('[FORMS] Conditional', { conditions, logic, results, show: shouldShow });
      }
    };

    const inputs = [];
    conditions.forEach(cond => {
      const fieldset = form.querySelector(`fieldset[data-form-name='${cond.field}']`);
      if ( !fieldset ) return;
      fieldset.querySelectorAll('input,textarea,select').forEach(i => {
        inputs.push(i);
        i.addEventListener('change', evaluate);
        i.addEventListener('keyup', evaluate);
      });
    });

    evaluate();

    return () => {
      inputs.forEach(i => {
        i.removeEventListener('change', evaluate);
        i.removeEventListener('keyup', evaluate);
      });
    };
  }, [id, JSON.stringify(conditions), logic]);

  return null;
};

export default FormConditional;
