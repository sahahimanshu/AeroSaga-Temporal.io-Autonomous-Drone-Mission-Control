import './TextField.css';

/**
 * Generic labeled text input with a leading icon and inline error message.
 * Controlled component — all state lives in the parent form.
 */
function TextField({
  id,
  label,
  icon: Icon,
  error,
  optional = false,
  ...inputProps
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="text-field">
      <label htmlFor={id} className="text-field__label">
        {label}
        {optional && <span className="text-field__optional"> (Optional)</span>}
      </label>
      <div className={`text-field__control ${error ? 'text-field__control--error' : ''}`}>
        {Icon && (
          <span className="text-field__icon" aria-hidden="true">
            <Icon size={17} strokeWidth={1.8} />
          </span>
        )}
        <input
          id={id}
          className="text-field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...inputProps}
        />
      </div>
      {error && (
        <p id={errorId} className="text-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextField;
