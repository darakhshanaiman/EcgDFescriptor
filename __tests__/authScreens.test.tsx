import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../app/(auth)/login';
import SignupScreen from '../app/(auth)/signup';
import ForgotPasswordScreen from '../app/(auth)/forgot-password';
import { useAuth } from '../lib/contexts/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), replace: jest.fn() }
}));

jest.mock('../lib/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
  getAuth: jest.fn()
}));

jest.mock('../lib/firebase', () => ({
  auth: {}
}));

jest.spyOn(Alert, 'alert');

const mockLogIn = jest.fn();
const mockSignUp = jest.fn();
const mockSignInWithGoogle = jest.fn();

// Mock Icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View testID={`icon-ionicons-${props.name}`} />,
    AntDesign: (props: any) => <View testID={`icon-antdesign-${props.name}`} />,
    FontAwesome: (props: any) => <View testID={`icon-fontawesome-${props.name}`} />
  };
});

describe('Authentication Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      logIn: mockLogIn,
      signUp: mockSignUp,
      signInWithGoogle: mockSignInWithGoogle
    });
  });

  describe('Login Screen', () => {
    it('test_login_screen_renders_inputs', () => {
      const { getAllByText, getByPlaceholderText, getByText } = render(<LoginScreen />);
      const loginTexts = getAllByText('Log In');
      expect(loginTexts.length).toBeGreaterThanOrEqual(1);
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter a password')).toBeTruthy();
      expect(getByText('Login with Google')).toBeTruthy();
    });

    it('test_login_screen_types_values', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter a password');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(emailInput.props.value).toBe('test@example.com');
      expect(passwordInput.props.value).toBe('password123');
    });

    it('test_login_shows_invalid_submission_error', async () => {
      mockLogIn.mockRejectedValue(new Error('Invalid credentials provided'));
      const { getAllByText, getByPlaceholderText, queryByText, findByText } = render(<LoginScreen />);
      expect(queryByText('Invalid credentials provided')).toBeNull();

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter a password'), 'wrongpassword');

      const loginButtons = getAllByText('Log In');
      fireEvent.press(loginButtons[loginButtons.length - 1]);

      const errorMessage = await findByText('Invalid credentials provided');
      expect(errorMessage).toBeTruthy();
    });
  });

  describe('Signup Screen', () => {
    it('test_signup_screen_renders_inputs', () => {
      const { getAllByText, getByPlaceholderText } = render(<SignupScreen />);
      const signupTexts = getAllByText('Sign Up');
      expect(signupTexts.length).toBeGreaterThanOrEqual(1);
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter a password')).toBeTruthy();
      expect(getByPlaceholderText('Enter a password to confirm')).toBeTruthy();
    });

    it('test_signup_shows_empty_fields_error', async () => {
      const { getAllByText, findByText } = render(<SignupScreen />);
      const signupButtons = getAllByText('Sign Up');
      fireEvent.press(signupButtons[signupButtons.length - 1]);

      const errorMessage = await findByText('Please fill in all fields.');
      expect(errorMessage).toBeTruthy();
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('test_signup_shows_password_mismatch', async () => {
      const { getAllByText, getByPlaceholderText, findByText } = render(<SignupScreen />);
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter a password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Enter a password to confirm'), 'password456');

      const signupButtons = getAllByText('Sign Up');
      fireEvent.press(signupButtons[signupButtons.length - 1]);

      const errorMessage = await findByText('Passwords do not match.');
      expect(errorMessage).toBeTruthy();
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  describe('Forgot Password Screen', () => {
    it('test_forgot_password_renders_inputs', () => {
      const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
      expect(getByText('Forgot password?')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByText('Reset password')).toBeTruthy();
    });

    it('test_forgot_password_shows_missing_email_alert', () => {
      const { getByText } = render(<ForgotPasswordScreen />);
      fireEvent.press(getByText('Reset password'));
      expect(Alert.alert).toHaveBeenCalledWith("Missing email", "Please enter your email address.");
    });

    it('test_forgot_password_triggers_reset_and_navigates', async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(true);
      const { getByText, getByPlaceholderText } = render(<ForgotPasswordScreen />);

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.press(getByText('Reset password'));

      await waitFor(() => {
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'test@example.com');
        expect(router.push).toHaveBeenCalledWith('/check-email');
      });
    });
  });
});
