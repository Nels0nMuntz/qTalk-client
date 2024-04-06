import { render } from '@testing-library/react';
import SignIn from '../SignIn'

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

describe('SignIn component', () => {
  window.ResizeObserver = ResizeObserver;
  it('renders correctly', async () => {
    const { container } = render(<SignIn/>);
    expect(container).toMatchSnapshot();
  });
})