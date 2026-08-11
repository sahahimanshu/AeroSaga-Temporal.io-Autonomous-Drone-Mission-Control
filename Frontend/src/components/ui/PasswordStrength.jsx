import { getPasswordStrength } from '../../utils/validators.js';
import './PasswordStrength.css';

const LEVELS = [
  { label: 'Weak', className: 'password-strength__bar--weak' },
  { label: 'Fair', className: 'password-strength__bar--fair' },
  { label: 'Good', className: 'password-strength__bar--good' },
  { label: 'Strong', className: 'password-strength__bar--strong' },
];

/**
 * Visual strength meter driven by the shared getPasswordStrength scorer.
 * Renders nothing until the user starts typing.
 */
function PasswordStrength({ password }) {
  if (!password) return null;

  const score = getPasswordStrength(password);
  const level = LEVELS[Math.max(score - 1, 0)];

  return (
    <div className="password-strength">
      <div className="password-strength__track">
        {LEVELS.map((_, index) => (
          <span
            key={index}
            className={`password-strength__bar ${index < score ? level.className : ''}`}
          />
        ))}
      </div>
      <span className="password-strength__label">{level.label}</span>
    </div>
  );
}

export default PasswordStrength;
