import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import SignInWithGoogleButton from '../SignInWithGoogleButton';

jest.mock('../../../hooks/useSignInWithGoogle.tsx');

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const mockUseSignInWithGoogle = jest.requireMock(
  '../../../hooks/useSignInWithGoogle.tsx',
);

describe('SignInWithGoogleButton component', () => {
  it('renders correctly', async () => {
    mockUseSignInWithGoogle.default.mockReturnValueOnce({
      isLoading: false,
      signInWithGoogle: jest.fn(),
    });

    const { container } = render(<SignInWithGoogleButton />);

    const button = await screen.findByRole('button', {
      name: /Continue with Google/,
    });

    expect(button).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it('button is disabled when isLoading variable is equal to true', async () => {
    mockUseSignInWithGoogle.default.mockReturnValueOnce({
      isLoading: true,
      signInWithGoogle: jest.fn(),
    });

    render(<SignInWithGoogleButton />);

    const button = await screen.findByRole('button', {
      name: /Continue with Google/,
    });

    expect(button).toBeDisabled();
  });
  it('button is enabled when isLoading variable is equal to false', async () => {
    mockUseSignInWithGoogle.default.mockReturnValueOnce({
      isLoading: false,
      signInWithGoogle: jest.fn(),
    });

    render(<SignInWithGoogleButton />);

    const button = await screen.findByRole('button', {
      name: /Continue with Google/,
    });

    expect(button).toBeEnabled();
  });
  it('Google icon is visible when isLoading variable is equal to false', async () => {
    mockUseSignInWithGoogle.default.mockReturnValueOnce({
      isLoading: false,
      signInWithGoogle: jest.fn(),
    });

    render(<SignInWithGoogleButton />);

    await screen.findByRole('button');

    const googleIcon = screen.queryByTestId('google-icon');

    expect(googleIcon).toBeInTheDocument();
  });
  it('Google icon is not visible when isLoading variable is equal to true', async () => {
    mockUseSignInWithGoogle.default.mockReturnValueOnce({
      isLoading: true,
      signInWithGoogle: jest.fn(),
    });

    render(<SignInWithGoogleButton />);

    await screen.findByRole('button');

    const googleIcon = screen.queryByTestId('google-icon');

    expect(googleIcon).not.toBeInTheDocument();
  });
  it('calls signInWithGoogle callback when user clicked on the button', async () => {
    const mockSignInWithGoogle = jest.fn();
    mockUseSignInWithGoogle.default.mockReturnValueOnce({
      isLoading: false,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<SignInWithGoogleButton />);

    const button = await screen.findByRole('button', {
      name: /Continue with Google/,
    });

    await user.click(button);

    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });
});
