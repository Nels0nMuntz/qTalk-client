import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notify } from '@/lib/utils';
import SignInForm from '../SignInForm';
import { SignInFormSchema } from '@/lib/validators';


jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => ({
    get: jest.fn(() => '/'),
  }),
}));

jest.mock('../../../lib/utils/notify.tsx', () => ({
  notify: jest.fn(),
}));

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

const submitForm = async (formData: SignInFormSchema) => {

  render(<SignInForm />);

  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = await screen.findByLabelText('Password');
  const checkbox = await screen.findByRole('checkbox', {
    name: 'Remember Me',
  });
  const submitButton = await screen.findByRole('button', {
    name: /sign in/i,
  });

  await user.type(emailInput, formData.email);
  await user.type(passwordInput, formData.password);
  await user.click(checkbox); 
  await user.click(submitButton);
}

describe('SignInForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });
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

    await submitForm(formData);

    expect(signIn).toHaveBeenCalledWith('credentials', {
      ...formData,
      redirect: false,
      callbackUrl: '/',
    });
  });

  it('redirects to home after successful signin', async () => {
    const signInMock = signIn as jest.MockedFunction<typeof signIn>;
    signInMock.mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: '/'
    });

    const formData = {
      email: 'jenna@jenna.com',
      password: 'jennajenna',
      rememberMe: true,
    };

    await submitForm(formData);

    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockRefresh).toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it('show error notification if signin failed', async () => {
    const signInMock = signIn as jest.MockedFunction<typeof signIn>;
    signInMock.mockResolvedValue({
      ok: false,
      error: null,
      status: 400,
      url: '/'
    });

    const formData = {
      email: 'jenna@jenna.com',
      password: 'jennajenna',
      rememberMe: true,
    };

    await submitForm(formData);

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalled();
  })
});
