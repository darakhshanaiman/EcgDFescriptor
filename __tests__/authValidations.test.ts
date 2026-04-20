import { validateLogin, validateSignup, validateForgotPassword } from '../lib/authValidations';

describe('Authentication Validation Logic', () => {

  describe('Login Validation', () => {
    it('test_login_returns_errors_for_empty_fields', () => {
      const result = validateLogin('', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required.');
      expect(result.errors.password).toBe('Password is required.');
    });

    it('test_login_rejects_invalid_email', () => {
      const result = validateLogin('invalid-email-format', 'password123');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address.');
      expect(result.errors.password).toBeUndefined(); // Assuming password length > 6
    });

    it('test_login_accepts_valid_input', () => {
      const result = validateLogin('user@example.com', 'securePassword!123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('Signup Validation', () => {
    it('test_signup_returns_errors_for_empty_fields', () => {
      const result = validateSignup('', '', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required.');
      expect(result.errors.password).toBe('Password is required.');
    });

    it('test_signup_rejects_password_mismatch', () => {
      // Valid email and password, but confirmation does not match
      const result = validateSignup('hello@world.com', 'password123', 'password456');
      expect(result.isValid).toBe(false);
      expect(result.errors.confirmPassword).toBe('Passwords do not match.');
    });

    it('test_signup_accepts_valid_input', () => {
      const result = validateSignup('hello@world.com', 'mypassword99', 'mypassword99');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('Forgot Password Validation', () => {
    it('test_forgot_password_requires_email', () => {
      const result = validateForgotPassword('');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required.');
    });

    it('test_forgot_password_rejects_invalid_email', () => {
      const result = validateForgotPassword('notanemail.com');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address.');
    });

    it('test_forgot_password_accepts_valid_input', () => {
      const result = validateForgotPassword('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

});
