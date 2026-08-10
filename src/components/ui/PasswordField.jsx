import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import './TextField.css';

/**
 * Password input with a show/hide toggle. Mirrors TextField's markup so the
 * two share styling, but needs its own toggle button in the control row.
 */
function PasswordField({ id, label, error, strengthMeter, ...inputProps }) {
  const [visible, setVisible] = useState(false);
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="text-field">
      <label htmlFor={id} className="text-field__label">
        {label}
      </label>
      <div className={`text-field__control ${error ? 'text-field__control--error' : ''}`}>
        <span className="text-field__icon" aria-hidden="true">
          <Lock size={17} strokeWidth={1.8} />
        </span>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="text-field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...inputProps}
        />
        <button
          type="button"
          className="text-field__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
        </button>
      </div>
      {strengthMeter}
      {error && (
        <p id={errorId} className="text-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordField;
