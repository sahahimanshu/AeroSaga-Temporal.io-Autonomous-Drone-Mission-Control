import { VALIDATION_MESSAGES } from './validationMessages.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,20}$/;
const NAME_REGEX = /^[a-zA-Z][a-zA-Z' -]{1,49}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
// At least 1 lowercase, 1 uppercase, 1 digit, 1 special char, 8-64 length
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/;

/** Returns true if the raw value has leading or trailing whitespace. */
export function hasSurroundingWhitespace(value = '') {
  return value !== value.trim();
}

/** Trims a value safely for use before validation/submission. */
export function trimValue(value = '') {
  return value.trim();
}

export function validateRequired(value, fieldLabel) {
  if (!value || !value.trim()) {
    return VALIDATION_MESSAGES.required(fieldLabel);
  }
  return '';
}

export function validateFullName(value) {
  const requiredError = validateRequired(value, 'Full name');
  if (requiredError) return requiredError;
  if (hasSurroundingWhitespace(value)) return VALIDATION_MESSAGES.leadingTrailingWhitespace;
  const trimmed = trimValue(value);
  if (trimmed.length < 2) return VALIDATION_MESSAGES.minLength('Full name', 2);
  if (trimmed.length > 50) return VALIDATION_MESSAGES.maxLength('Full name', 50);
  if (!NAME_REGEX.test(trimmed)) return VALIDATION_MESSAGES.invalidName;
  return '';
}

export function validateEmail(value) {
  const requiredError = validateRequired(value, 'Email');
  if (requiredError) return requiredError;
  if (hasSurroundingWhitespace(value)) return VALIDATION_MESSAGES.leadingTrailingWhitespace;
  if (!EMAIL_REGEX.test(trimValue(value))) return VALIDATION_MESSAGES.invalidEmail;
  return '';
}

export function validateEmailOrUsername(value) {
  const requiredError = validateRequired(value, 'Email or username');
  if (requiredError) return requiredError;
  if (hasSurroundingWhitespace(value)) return VALIDATION_MESSAGES.leadingTrailingWhitespace;
  const trimmed = trimValue(value);
  const isEmail = trimmed.includes('@');
  if (isEmail && !EMAIL_REGEX.test(trimmed)) return VALIDATION_MESSAGES.invalidEmailOrUsername;
  if (!isEmail && !USERNAME_REGEX.test(trimmed)) return VALIDATION_MESSAGES.invalidEmailOrUsername;
  return '';
}

export function validateUsername(value) {
  const requiredError = validateRequired(value, 'Username');
  if (requiredError) return requiredError;
  if (hasSurroundingWhitespace(value)) return VALIDATION_MESSAGES.leadingTrailingWhitespace;
  if (!USERNAME_REGEX.test(trimValue(value))) return VALIDATION_MESSAGES.invalidUsername;
  return '';
}

export function validatePhone(value) {
  const requiredError = validateRequired(value, 'Phone number');
  if (requiredError) return requiredError;
  const trimmed = trimValue(value);
  if (!PHONE_REGEX.test(trimmed.replace(/[\s()-]/g, ''))) return VALIDATION_MESSAGES.invalidPhone;
  return '';
}

export function validatePassword(value) {
  const requiredError = validateRequired(value, 'Password');
  if (requiredError) return requiredError;
  if (hasSurroundingWhitespace(value)) return VALIDATION_MESSAGES.leadingTrailingWhitespace;
  if (!PASSWORD_REGEX.test(value)) return VALIDATION_MESSAGES.invalidPassword;
  return '';
}

/** Login passwords only need to exist — strength was enforced at registration. */
export function validateLoginPassword(value) {
  return validateRequired(value, 'Password');
}

export function validateConfirmPassword(password, confirmPassword) {
  const requiredError = validateRequired(confirmPassword, 'Confirm password');
  if (requiredError) return requiredError;
  if (password !== confirmPassword) return VALIDATION_MESSAGES.passwordMismatch;
  return '';
}

export function validateTermsAccepted(value) {
  return value ? '' : VALIDATION_MESSAGES.termsRequired;
}

/** Scores password strength 0-4 for the strength meter UI. */
export function getPasswordStrength(value = '') {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}
