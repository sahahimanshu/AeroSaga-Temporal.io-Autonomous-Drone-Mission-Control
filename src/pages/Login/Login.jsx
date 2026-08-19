import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import AuthCard from '../../components/common/AuthCard.jsx';
import Brand from '../../components/common/Brand.jsx';
import HeroVisual from '../../components/common/HeroVisual.jsx';
import Alert from '../../components/common/Alert.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        ...validateForm({
          ...form,
          [name]: nextValue,
        }),
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
      const response = await fetch(
        'http://localhost:8082/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.emailOrUsername,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Invalid email or password'
        );
      }

      console.log('Login successful:', data);

      // Save logged-in user
      localStorage.setItem('user', JSON.stringify(data));

      // Show success modal
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Login error:', error);
      setSubmitError(
        error.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueAfterLogin = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    setSubmitError(
      'Google sign-in is not yet connected. Please use your email or username.'
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
            placeholder="Enter your email or username"
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

      <SuccessModal
        isOpen={showSuccessModal}
        onContinue={handleContinueAfterLogin}
      />
    </AuthCard>
  );
}

export default Login;