import { Loader2 } from 'lucide-react';
import './Button.css';

/**
 * Primary/secondary button with a built-in loading + disabled state.
 */
function Button({
  children,
  variant = 'primary',
  icon: Icon,
  loading = false,
  disabled = false,
  type = 'button',
  ...buttonProps
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...buttonProps}
    >
      {loading ? (
        <span className="btn__spinner" aria-hidden="true">
          <Loader2 size={18} strokeWidth={2.2} />
        </span>
      ) : (
        Icon && (
          <span className="btn__icon" aria-hidden="true">
            <Icon size={18} strokeWidth={2} />
          </span>
        )
      )}
      <span>{loading ? 'Please wait…' : children}</span>
    </button>
  );
}

export default Button;
