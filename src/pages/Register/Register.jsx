import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  AtSign,
  Phone,
  ShieldCheck,
  Building2,
  UserPlus,
} from 'lucide-react';

import AuthCard from '../../components/common/AuthCard.jsx';
import Brand from '../../components/common/Brand.jsx';
import HeroVisual from '../../components/common/HeroVisual.jsx';
import Alert from '../../components/common/Alert.jsx';
import TextField from '../../components/ui/TextField.jsx';
import SelectField from '../../components/ui/SelectField.jsx';
import PasswordField from '../../components/ui/PasswordField.jsx';
import PasswordStrength from '../../components/ui/PasswordStrength.jsx';
import Checkbox from '../../components/ui/Checkbox.jsx';
import Button from '../../components/ui/Button.jsx';

import {
  validateFullName,
  validateEmail,
  validateUsername,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateTermsAccepted,
  trimValue,
} from '../../utils/validators.js';

import './Register.css';

const API_URL = 'http://localhost:8082/api/users';

const ROLE_OPTIONS = [
  { value: 'mission-operator', label: 'Mission Operator' },
  { value: 'fleet-manager', label: 'Fleet Manager' },
  { value: 'data-analyst', label: 'Data Analyst' },
  { value: 'administrator', label: 'Administrator' },
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  username: '',
  phone: '',
  role: ROLE_OPTIONS[0].value,
  organization: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

function validateForm(form) {
  return {
    fullName: validateFullName(form.fullName),
    email: validateEmail(form.email),
    username: validateUsername(form.username),
    phone: validatePhone(form.phone),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(
      form.password,
      form.confirmPassword
    ),
    termsAccepted: validateTermsAccepted(form.termsAccepted),
  };
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    const nextValue = type === 'checkbox' ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (touched[name]) {
      const updatedForm = {
        ...form,
        [name]: nextValue,
      };

      setErrors((prev) => ({
        ...prev,
        ...validateForm(updatedForm),
      }));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setForm((prev) => {
      const trimmed =
        typeof prev[name] === 'string' &&
        name !== 'password' &&
        name !== 'confirmPassword'
          ? trimValue(prev[name])
          : prev[name];

      const updatedForm = {
        ...prev,
        [name]: trimmed,
      };

      setErrors((prevErrors) => ({
        ...prevErrors,
        ...validateForm(updatedForm),
      }));

      return updatedForm;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError('');

    const nextErrors = validateForm(form);

    setErrors(nextErrors);

    setTouched({
      fullName: true,
      email: true,
      username: true,
      phone: true,
      password: true,
      confirmPassword: true,
      termsAccepted: true,
    });

    if (hasErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Backend User entity accepts:
       * name
       * email
       * password
       * role
       */

      const userData = {
        name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };

      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed. Please try again.';

        try {
          const errorData = await response.json();

          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Backend may return non-JSON error response.
        }

        throw new Error(errorMessage);
      }

      const savedUser = await response.json();

      console.log('Registration successful:', savedUser);

      navigate('/login', {
        state: {
          successMessage:
            'Registration successful. Please login to continue.',
        },
      });
    } catch (error) {
      console.error('Registration error:', error);

      if (error.name === 'TypeError') {
        setSubmitError(
          'Unable to connect to the server. Please make sure the backend is running on port 8082.'
        );
      } else {
        setSubmitError(
          error.message || 'Registration failed. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard split>
      <div className="register-visual">
        <HeroVisual variant="panel" />
      </div>

      <div className="register-content">
        <Brand />

        <div className="register-heading">
          <h2 className="register-heading__title">
            Create Account
          </h2>

          <p className="register-heading__subtitle">
            Join AeroSaga and start managing your drone missions
          </p>
        </div>

        {submitError && (
          <Alert variant="error">
            {submitError}
          </Alert>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            id="fullName"
            name="fullName"
            label="Full Name"
            icon={User}
            placeholder="Enter your full name"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fullName ? errors.fullName : ''}
          />

          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            icon={Mail}
            placeholder="Enter your email address"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ''}
          />

          <TextField
            id="username"
            name="username"
            label="Username"
            icon={AtSign}
            placeholder="Choose a username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username ? errors.username : ''}
          />

          <TextField
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            icon={Phone}
            placeholder="Enter your phone number"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone ? errors.phone : ''}
          />

          <SelectField
            id="role"
            name="role"
            label="Role"
            icon={ShieldCheck}
            options={ROLE_OPTIONS}
            value={form.role}
            onChange={handleChange}
          />

          <TextField
            id="organization"
            name="organization"
            label="Organization / Team"
            icon={Building2}
            placeholder="Enter organization or team name"
            optional
            value={form.organization}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <PasswordField
            id="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : ''}
            strengthMeter={
              <PasswordStrength password={form.password} />
            }
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.confirmPassword
                ? errors.confirmPassword
                : ''
            }
          />

          <Checkbox
            id="termsAccepted"
            name="termsAccepted"
            checked={form.termsAccepted}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.termsAccepted
                ? errors.termsAccepted
                : ''
            }
            label={
              <>
                I agree to the{' '}
                <Link to="/terms">
                  Terms &amp; Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy">
                  Privacy Policy
                </Link>
              </>
            }
          />

          <Button
            type="submit"
            icon={UserPlus}
            loading={isSubmitting}
          >
            Create Account
          </Button>

          <p className="register-footer">
            Already have an account?{' '}
            <Link to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthCard>
  );
}

export default Register;