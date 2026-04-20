import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LandingScreen from '../app/index';
import { useAuth } from '../lib/contexts/AuthContext';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn() }
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('Landing Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test_landing_screen_renders_mobile_layout', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false
    });

    // React Native testing library default width is ~750, so it hits isMobile
    const { getByText } = render(<LandingScreen />);

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Lifeline.ai')).toBeTruthy();
    expect(getByText('Log In')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('test_landing_screen_navigates_to_login', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false
    });

    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText('Log In'));

    expect(router.push).toHaveBeenCalledWith('/login');
  });

  it('test_landing_screen_navigates_to_signup', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false
    });

    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText('Get Started'));

    expect(router.push).toHaveBeenCalledWith('/signup');
  });

  it('test_landing_screen_redirects_if_logged_in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '123' },
      loading: false
    });

    render(<LandingScreen />);

    expect(router.replace).toHaveBeenCalledWith('/(app)');
  });

  it('test_landing_screen_shows_nothing_while_loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true
    });

    const { queryByText } = render(<LandingScreen />);

    expect(queryByText('Welcome Back')).toBeNull();
  });
});
