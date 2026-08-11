import './TextField.css';
import './SelectField.css';

/**
 * Labeled select input, styled to match TextField so form rows stay aligned.
 */
function SelectField({ id, label, icon: Icon, error, options, ...selectProps }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="text-field">
      <label htmlFor={id} className="text-field__label">
        {label}
      </label>
      <div className={`text-field__control select-field__control ${error ? 'text-field__control--error' : ''}`}>
        {Icon && (
          <span className="text-field__icon" aria-hidden="true">
            <Icon size={17} strokeWidth={1.8} />
          </span>
        )}
        <select
          id={id}
          className="text-field__input select-field__select"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id={errorId} className="text-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default SelectField;
