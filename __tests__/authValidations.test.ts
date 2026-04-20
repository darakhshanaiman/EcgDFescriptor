import { validateLogin, validateSignup, validateForgotPassword } from '../lib/authValidations';

describe('Authentication Validation Logic', () => {

  describe('Login Validation', () => {
    it('returns errors for empty fields', () => {
      const result = validateLogin('', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required.');
      expect(result.errors.password).toBe('Password is required.');
    });

    it('returns error for invalid email', () => {
      const result = validateLogin('invalid-email-format', 'password123');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address.');
      expect(result.errors.password).toBeUndefined(); // Assuming password length > 6
    });

    it('returns valid for proper input cases', () => {
      const result = validateLogin('user@example.com', 'securePassword!123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('Signup Validation', () => {
    it('returns errors for empty fields', () => {
      const result = validateSignup('', '', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required.');
      expect(result.errors.password).toBe('Password is required.');
    });

    it('returns error for password mismatch', () => {
      // Valid email and password, but confirmation does not match
      const result = validateSignup('hello@world.com', 'password123', 'password456');
      expect(result.isValid).toBe(false);
      expect(result.errors.confirmPassword).toBe('Passwords do not match.');
    });

    it('returns valid for proper input cases', () => {
      const result = validateSignup('hello@world.com', 'mypassword99', 'mypassword99');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('Forgot Password Validation', () => {
    it('returns errors for empty email', () => {
      const result = validateForgotPassword('');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required.');
    });

    it('returns error for invalid email', () => {
      const result = validateForgotPassword('notanemail.com');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address.');
    });

    it('returns valid for proper input cases', () => {
      const result = validateForgotPassword('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

});
