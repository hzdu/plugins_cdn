// FormField.js

const FormField = (props) => {
  const { params } = props;
  const {
    id, label, type, name, options, required, placeholder,
    default: defaultValue, // rename "default" to avoid collision
    maxlength, rows, className
  } = params;

  const parsedOptions = options ? JSON.parse(decodeURIComponent(options)) : null;
  const baseClass = 'mwai-form-field mwai-form-field-' + type;
  const classStr = `${baseClass}${className ? ' ' + className : ''}`;
  const isRequired = required === true;

  /**
   * For checkboxes and radio, we might have multiple default items (e.g. "option1,option2").
   * For a single item, you can just pass it as a string in `defaultValue`.
   * For text, textarea, select => we have data-default-value.
   */
  const dataDefaultValueAttr = defaultValue ? { 'data-default-value': defaultValue } : {};
  const dataFormRequiredAttr = { 'data-form-required': isRequired };

  switch (type) {
  case 'select':
    return (
      <fieldset
        id={id}
        className={classStr}
        data-form-name={name}
        data-form-type="select"
        {...dataFormRequiredAttr}
        {...dataDefaultValueAttr} // <select> can have a single default string
      >
        <legend>{label}</legend>
        <div className="mwai-form-field-container">
          <select name={name} required={required === 'yes'}>
            {parsedOptions && parsedOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
    );

  case 'radio':
    // For default, we store the "checked" value in data-default-value on the FIELDSET,
    // e.g. data-default-value="option_value"
    return (
      <fieldset
        id={id}
        className={classStr}
        data-form-name={name}
        data-form-type="radio"
        {...dataFormRequiredAttr}
        {...(defaultValue ? { 'data-default-value': defaultValue } : {})}
      >
        <legend>{label}</legend>
        {parsedOptions && parsedOptions.map(option => (
          <div className="mwai-form-field-container" key={option.value}>
            <input
              id={`${id}-${name}-${option.value}`}
              type="radio"
              name={name}
              value={option.value}
              required={required === 'yes'}
            />
            <label htmlFor={`${id}-${name}-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </fieldset>
    );

  case 'checkbox':
    // Similarly, for checkboxes, we might store multiple comma-separated defaults
    // e.g. data-default-value="option1,option2"
    return (
      <fieldset
        id={id}
        className={classStr}
        data-form-name={name}
        data-form-type="checkbox"
        {...dataFormRequiredAttr}
        {...(defaultValue ? { 'data-default-value': defaultValue } : {})}
      >
        <legend>{label}</legend>
        {parsedOptions && parsedOptions.map(option => (
          <div className="mwai-form-field-container" key={option.value}>
            <input
              id={`${id}-${name}-${option.value}`}
              type="checkbox"
              name={name}
              value={option.value}
              required={required === 'yes'}
            />
            <label htmlFor={`${id}-${name}-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </fieldset>
    );

  case 'textarea':
    return (
      <fieldset
        id={id}
        className={classStr}
        data-form-name={name}
        data-form-type="textarea"
        {...dataFormRequiredAttr}
        {...dataDefaultValueAttr}
      >
        <legend>{label}</legend>
        <div className="mwai-form-field-container">
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            maxLength={maxlength}
            rows={rows}
            required={required === 'yes'}
          />
        </div>
      </fieldset>
    );

  default:
    // E.g. type="text"
    return (
      <fieldset
        id={id}
        className={classStr}
        data-form-name={name}
        data-form-type="input"
        {...dataFormRequiredAttr}
        {...dataDefaultValueAttr}
      >
        <legend>{label}</legend>
        <div className="mwai-form-field-container">
          <input
            id={id}
            type="text"
            name={name}
            placeholder={placeholder}
            maxLength={maxlength}
            required={required === 'yes'}
          />
        </div>
      </fieldset>
    );
  }
};

export default FormField;
