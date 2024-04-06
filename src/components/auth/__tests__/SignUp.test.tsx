import { render } from '@testing-library/react';
import SignUp from '../SignUp';

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

describe('SignUp component', () => {
  it('renders correctly', async () => {
    const { container } = render(<SignUp/>);
    expect(container).toMatchSnapshot();
  });
})