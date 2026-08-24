import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';

import AuthCard from '../../components/common/AuthCard.jsx';
import Brand from '../../components/common/Brand.jsx';
import HeroVisual from '../../components/common/HeroVisual.jsx';
import Alert from '../../components/common/Alert.jsx';
import TextField from '../../components/ui/TextField.jsx';
import PasswordField from '../../components/ui/PasswordField.jsx';
import Checkbox from '../../components/ui/Checkbox.jsx';
import Button from '../../components/ui/Button.jsx';

import {
  validateEmailOrUsername,
  validateLoginPassword,
  trimValue,
} from '../../utils/validators.js';

import './Login.css';

const API_URL = 'http://localhost:8082/api/users/login';

const INITIAL_FORM = {
  emailOrUsername: '',
  password: '',
  rememberMe: false,
};

function validateForm(form) {
  return {
    emailOrUsername: validateEmailOrUsername(form.emailOrUsername),
    password: validateLoginPassword(form.password),
  };
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.successMessage;

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
      const updated =
        name === 'emailOrUsername'
          ? {
              ...prev,
              [name]: trimValue(prev[name]),
            }
          : prev;

      setErrors((prevErrors) => ({
        ...prevErrors,
        ...validateForm(updated),
      }));

      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError('');

    const nextErrors = validateForm(form);

    setErrors(nextErrors);

    setTouched({
      emailOrUsername: true,
      password: true,
    });

    if (hasErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Backend currently searches user by EMAIL.
       */
      const loginData = {
        email: form.emailOrUsername.trim(),
        password: form.password,
      };

      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        let errorMessage = 'Invalid email or password.';

        try {
          const errorData = await response.json();

          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Backend may return non-JSON error.
        }

        throw new Error(errorMessage);
      }

      const loggedInUser = await response.json();

      console.log('Login successful:', loggedInUser);

      /*
       * Save logged-in user for dashboard.
       */
      localStorage.setItem(
        'aerosagaUser',
        JSON.stringify(loggedInUser)
      );

      localStorage.setItem(
        'loginEmail',
        loggedInUser.email
      );

      /*
       * Go to dashboard only after backend
       * successfully verifies credentials.
       */
      navigate('/dashboard', {
        replace: true,
      });
    } catch (error) {
      console.error('Login error:', error);

      if (error.name === 'TypeError') {
        setSubmitError(
          'Unable to connect to the server. Please make sure the backend is running on port 8082.'
        );
      } else {
        setSubmitError(
          error.message || 'Login failed. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setSubmitError(
      'Google sign-in is not yet connected. Please use your email and password.'
    );
  };

  return (
    <AuthCard>
      <div className="login-content">
        <Brand />

        <div className="login-heading">
          <h2 className="login-heading__title">
            Welcome Back!
          </h2>

          <p className="login-heading__subtitle">
            Login to your AeroSaga account
          </p>
        </div>

        <HeroVisual variant="inline" />

        {successMessage && (
          <Alert variant="success">
            {successMessage}
          </Alert>
        )}

        {submitError && (
          <Alert variant="error">
            {submitError}
          </Alert>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            id="emailOrUsername"
            name="emailOrUsername"
            label="Email or Username"
            icon={User}
            placeholder="Enter your email"
            autoComplete="username"
            value={form.emailOrUsername}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.emailOrUsername
                ? errors.emailOrUsername
                : ''
            }
          />

          <PasswordField
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.password
                ? errors.password
                : ''
            }
          />

          <div className="login-row">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              label="Remember Me"
              checked={form.rememberMe}
              onChange={handleChange}
            />

            <Link
              to="/forgot-password"
              className="login-forgot"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            icon={LogIn}
            loading={isSubmitting}
          >
            Login
          </Button>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <Button
            variant="secondary"
            onClick={handleGoogleLogin}
            type="button"
          >
            Continue with Google
          </Button>

          <p className="login-footer">
            Don&apos;t have an account?{' '}
            <Link to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </AuthCard>
  );
}

export default Login;