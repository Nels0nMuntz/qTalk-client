import React from 'react';
import { render, screen, waitFor, renderHook } from '@testing-library/react';
import user from '@testing-library/user-event';
import SignInWithGoogleButton from './SignInWithGoogleButton';
import useSignInWithGoogle from '../../hooks/useSignInWithGoogle';

// const mockUseSignInWithGoogle = jest.mocked(useSignInWithGoogle)

// console.log({mockReturnValue: mockUseSignInWithGoogle.mockReturnValue});

// jest.mock('@/hooks/useSignInWithGoogle');

// const mock = { isLoading: true, signInWithGoogle: () => new Promise(() => {}) };

// jest.mock('../../hooks/useSignInWithGoogle.tsx', () => {
//     return () => mock;
// });
jest.mock('../../hooks/useSignInWithGoogle.tsx');
// jest.mock('../../hooks/useSignInWithGoogle.tsx', () => ({
//   useSignInWithGoogle: jest.fn(),
// }));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('SignInWithGoogleButton component', () => {
  it('button is disabled when isLoading variable is true', async () => {
    // jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    // mockUseSignInWithGoogle.mockReturnValue({ isLoading: true, signInWithGoogle: () => new Promise(() => {}) })
    // useSignInWithGoogle = jest.fn(() => () => mock)

    const mock = jest.requireMock('../../hooks/useSignInWithGoogle.tsx');
    mock.default.mockReturnValueOnce({
      isLoading: false,
      signInWithGoogle: () => new Promise(() => {}),
    });

     render(<SignInWithGoogleButton />);

    const button = await screen.findByRole('button', {
      name: /Continue with Google/,
    });

    expect(button).toBeDisabled();
  });
});
