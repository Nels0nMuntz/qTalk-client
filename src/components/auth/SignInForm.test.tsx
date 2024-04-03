import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import SignInForm from './SignInForm';

jest.mock('next/navigation');

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const queryEmailHelperText = (container: HTMLElement) => {
  return container.querySelector('form > div:first-child > input + p');
};

const queryPasswordHelperText = (container: HTMLElement) => {
  return container.querySelector('form > div:nth-child(2) > input + p');
};

describe('SignInForm component', () => {
  window.ResizeObserver = ResizeObserver;
  it('renders correctly', async () => {
    const { container } = render(<SignInForm />);

    const form = await screen.findByRole('form', { name: 'signin form' });

    expect(form).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it('renders emain validation errors correctly', async () => {
    const { container } = render(<SignInForm />);

    const emailInput = await screen.findByLabelText('Email');
    const submitButton = await screen.findByRole('button', {
      name: /sign in/i,
    });

    expect(emailInput).toHaveValue('');
    await user.click(submitButton);
    expect(queryEmailHelperText(container)).toHaveTextContent('Invalid email');

    await user.type(emailInput, 'wrong@email');
    expect(queryEmailHelperText(container)).toHaveTextContent('Invalid email');

    await user.clear(emailInput);
    await user.type(emailInput, 'right@gmail.com');
    expect(queryEmailHelperText(container)).toBeFalsy();
  });

  it('renders password validation errors correctly', async () => {
    const { container } = render(<SignInForm />);

    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = await screen.findByRole('button', {
      name: /sign in/i,
    });

    expect(passwordInput).toHaveValue('');
    await user.click(submitButton);
    expect(queryPasswordHelperText(container)).toHaveTextContent(
      'String must contain at least 6 character(s)',
    );

    await user.type(passwordInput, 'wrong');
    expect(queryPasswordHelperText(container)).toHaveTextContent(
      'String must contain at least 6 character(s)',
    );

    await user.clear(passwordInput);
    await user.type(passwordInput, 'toolongpasswordtoolongpassword');
    expect(queryPasswordHelperText(container)).toHaveTextContent(
      'String must contain at most 20 character(s)',
    );

    await user.clear(passwordInput);
    await user.type(passwordInput, 'goodpassword');
    expect(queryPasswordHelperText(container)).toBeFalsy();
  });

  it('toggles checkbox value', async () => {
    render(<SignInForm />);

    const checkbox = await screen.findByRole('checkbox');

    expect(checkbox).toHaveValue('false');

    await user.click(checkbox);

    expect(checkbox).toHaveValue('true');

    await user.click(checkbox);

    expect(checkbox).toHaveValue('false');
  });

  it('submits form with form values', async () => {
    const formData = {
      email: 'jenna@jenna.com',
      password: 'jennajenna',
      rememberMe: true,
    };

    const mockUseFormReturn = jest.mock('react-hook-form', () => {
      const realModule = jest.requireActual('react-hook-form');

      return () => ({
        ...realModule,
      });
    });
    console.log({ mockUseFormReturn });

    render(<SignInForm />);

    const emailInput = await screen.findByLabelText('Email');
    const passwordInput = await screen.findByLabelText('Password');
    const checkbox = await screen.findByRole('checkbox');
    const submitButton = await screen.findByRole('button', {
      name: /sign in/i,
    });

    await user.type(emailInput, formData.email);
    await user.type(passwordInput, formData.password);
    await user.click(checkbox);
  });
});
