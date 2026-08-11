import { CheckCircle2, AlertCircle } from 'lucide-react';
import './Alert.css';

/**
 * Inline banner for page-level feedback (e.g. "Registration successful").
 */
function Alert({ variant = 'success', children }) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`alert alert--${variant}`} role="status">
      <Icon size={18} strokeWidth={2} />
      <span>{children}</span>
    </div>
  );
}

export default Alert;
