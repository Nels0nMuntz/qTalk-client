import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import SignUpForm from '../SignUpForm';
import { SignUpFormSchema } from '@/lib/validators';
import { notify } from '@/lib/utils/notify';

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@/lib/utils/notify.tsx', () => ({
  notify: jest.fn(),
}));

const queryUsernameHelperText = (container: HTMLElement) => {
  return container.querySelector('form > div:nth-child(1) > input + p');
};
const queryEmailHelperText = (container: HTMLElement) => {
  return container.querySelector('form > div:nth-child(2) > input + p');
};
const queryPasswordHelperText = (container: HTMLElement) => {
  return container.querySelector('form > div:nth-child(3) > input + p');
};
const queryConfirmPasswordHelperText = (container: HTMLElement) => {
  return container.querySelector('form > div:nth-child(4) > input + p');
};

const submitForm = async (formData: SignUpFormSchema) => {
  render(<SignUpForm />);

  const usernameInput = await screen.findByLabelText('Username');
  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = await screen.findByLabelText('Password');
  const confirmPasswordInput = await screen.findByLabelText('Confirm Password');
  const submitButton = await screen.findByRole('button', {
    name: /get started/i,
  });

  await user.type(usernameInput, formData.username);
  await user.type(emailInput, formData.email);
  await user.type(passwordInput, formData.password);
  await user.type(confirmPasswordInput, formData.confirmPassword);
  await user.click(submitButton);
};

describe('SignUpForm component', () => {
  it('renders correctly', async () => {
    const { container } = render(<SignUpForm />);

    const form = await screen.findByRole('form', { name: 'signup form' });

    expect(form).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders Username validation errors correctly', async () => {
    const { container } = render(<SignUpForm />);

    const usernameInput = await screen.findByLabelText('Username');
    const submitButton = await screen.findByRole('button', {
      name: /get started/i,
    });

    expect(usernameInput).toHaveValue('');
    await user.click(submitButton);
    expect(queryUsernameHelperText(container)).toHaveTextContent(
      'String must contain at least 2 character(s)',
    );

    await user.type(usernameInput, 'U');
    expect(queryUsernameHelperText(container)).toHaveTextContent(
      'String must contain at least 2 character(s)',
    );

    await user.clear(usernameInput);
    await user.type(
      usernameInput,
      'more then 50 character more then 50 character more then 50 character',
    );
    expect(queryUsernameHelperText(container)).toHaveTextContent(
      'String must contain at most 50 character(s)',
    );

    await user.clear(usernameInput);
    await user.type(usernameInput, 'Mark');
    expect(queryUsernameHelperText(container)).toBeFalsy();
  });

  it('renders emain validation errors correctly', async () => {
    const { container } = render(<SignUpForm />);

    const emailInput = await screen.findByLabelText('Email');
    const submitButton = await screen.findByRole('button', {
      name: /get started/i,
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
    const { container } = render(<SignUpForm />);

    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = await screen.findByRole('button', {
      name: /get started/i,
    });

    expect(passwordInput).toHaveValue('');
    await user.click(submitButton);
    expect(queryPasswordHelperText(container)).toHaveTextContent(
      'String must contain at least 6 character(s)',
    );

    await user.type(passwordInput, 'd7a92');
    expect(queryPasswordHelperText(container)).toHaveTextContent(
      'String must contain at least 6 character(s)',
    );

    await user.clear(passwordInput);
    await user.type(passwordInput, 'd7a92f5c4e5d9a3b4f7c5');
    expect(queryPasswordHelperText(container)).toHaveTextContent(
      'String must contain at most 20 character(s)',
    );

    await user.clear(passwordInput);
    await user.type(passwordInput, 'd7a92f5c4e5d9a3b4f7c');
    expect(queryPasswordHelperText(container)).toBeFalsy();
  });

  it('renders confirm password field validation errors correctly', async () => {
    const { container } = render(<SignUpForm />);

    const passwordInput = await screen.findByLabelText('Password');
    const confirmPasswordInput =
      await screen.findByLabelText('Confirm Password');
    const submitButton = await screen.findByRole('button', {
      name: /get started/i,
    });

    expect(passwordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');

    await user.type(passwordInput, 'd7a92f5c4e5d9a3b4f7c');
    await user.click(submitButton);
    expect(queryConfirmPasswordHelperText(container)).toHaveTextContent(
      'Passwords must match!',
    );

    await user.type(confirmPasswordInput, 'd7a92f5c4e5d9a3b4f7c'.toUpperCase());
    expect(queryConfirmPasswordHelperText(container)).toHaveTextContent(
      'Passwords must match!',
    );

    await user.clear(confirmPasswordInput);
    await user.type(confirmPasswordInput, 'd7a92f5c4e5d9a3b4f7c');
    expect(queryConfirmPasswordHelperText(container)).toBeFalsy();
  });

  it('submits form with form values', async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve({}),
        status: 201,
      });
    }) as jest.Mock;

    const values = {
      username: 'Jenna',
      email: 'jenna@jenna.com',
      password: 'jennajenna',
      confirmPassword: 'jennajenna',
    };

    await submitForm(values);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/user', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('redirects to sign-in page after user was successfully created', async () => {
    const responseMessage = 'User created successfully';
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ message: responseMessage }),
        status: 201,
      });
    }) as jest.Mock;

    const values = {
      username: 'Jenna',
      email: 'jenna@jenna.com',
      password: 'jennajenna',
      confirmPassword: 'jennajenna',
    };

    await submitForm(values);

    expect(notify).toHaveBeenCalledWith({
      title: responseMessage,
      variant: 'success',
    })
    expect(pushMock).toHaveBeenCalledWith('/sign-in');
  });

  it('shows error notification after signup request faild', async () => {
    const responseMessage = 'Error';
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ message: responseMessage })
      })
    }) as jest.Mock;

    const values = {
      username: 'Jenna',
      email: 'jenna@jenna.com',
      password: 'jennajenna',
      confirmPassword: 'jennajenna',
    };

    await submitForm(values);

    expect(notify).toHaveBeenCalledWith({
      title: responseMessage,
      variant: 'error',
    })
  });
});
