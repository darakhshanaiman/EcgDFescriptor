export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
};

export const validateLogin = (email?: string, password?: string): { isValid: boolean, errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(email || '');
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password || '');
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSignup = (email?: string, password?: string, confirmPassword?: string): { isValid: boolean, errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(email || '');
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password || '');
  if (passwordError) errors.password = passwordError;

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateForgotPassword = (email?: string): { isValid: boolean, errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(email || '');
  if (emailError) errors.email = emailError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
