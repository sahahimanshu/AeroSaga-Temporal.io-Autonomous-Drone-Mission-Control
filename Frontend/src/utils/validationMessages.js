// Centralized validation copy so messages stay consistent across forms.
export const VALIDATION_MESSAGES = {
  required: (field) => `${field} is required.`,
  minLength: (field, min) => `${field} must be at least ${min} characters.`,
  maxLength: (field, max) => `${field} must be no more than ${max} characters.`,
  invalidEmail: 'Enter a valid email address (e.g. name@example.com).',
  invalidEmailOrUsername: 'Enter a valid email address or username.',
  invalidUsername:
    'Username must be 3-20 characters and contain only letters, numbers, dots, or underscores.',
  invalidName: 'Name can only contain letters, spaces, apostrophes, and hyphens.',
  invalidPhone: 'Enter a valid phone number (10-15 digits).',
  invalidPassword:
    'Password must be 8-64 characters and include an uppercase letter, a lowercase letter, a number, and a special character.',
  passwordMismatch: 'Passwords do not match.',
  leadingTrailingWhitespace: 'This field cannot start or end with a space.',
  termsRequired: 'You must agree to the Terms & Conditions and Privacy Policy.',
};
