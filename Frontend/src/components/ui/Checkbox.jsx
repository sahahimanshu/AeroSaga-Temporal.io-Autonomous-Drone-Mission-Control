import './Checkbox.css';

/**
 * Styled checkbox with a label that accepts rich content (e.g. inline links).
 */
function Checkbox({ id, label, error, ...inputProps }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="checkbox-field">
      <div className="checkbox-field__row">
        <input
          id={id}
          type="checkbox"
          className="checkbox-field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...inputProps}
        />
        <label htmlFor={id} className="checkbox-field__label">
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} className="checkbox-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Checkbox;
