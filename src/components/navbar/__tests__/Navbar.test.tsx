import { render, screen } from "@testing-library/react";
import { getServerSession } from 'next-auth';
import Navbar from "../Navbar";

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))
jest.mock('@/lib/auth', () => ({
  authoOptions: {}
}))
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(), 
  useRouter: jest.fn(),
}))
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: {},
    refetch: jest.fn(),
    isFetched: false,
  })), 
}))
jest.mock('axios', () => ({}))

describe("Navbar component", () => {
  it('renders correctly when user is not logged in', async () => {
    const getServerSessionMock = getServerSession as jest.MockedFunction<typeof getServerSession>;
    getServerSessionMock.mockResolvedValueOnce({
      user: null,
    });

    const NavbarSync = await Navbar();
    const { container } = render(NavbarSync)

    const signInLink = await screen.findByRole('link', { name: 'Sign In' })
    const searchInput = screen.queryByRole('combobox');
    const userAccountButton = screen.queryByRole('button');

    expect(container).toMatchSnapshot();
    expect(signInLink).toBeInTheDocument();
    expect(searchInput).not.toBeInTheDocument();
    expect(userAccountButton).not.toBeInTheDocument();
  });
  it('renders correctly when user is logged in', async () => {
    const getServerSessionMock = getServerSession as jest.MockedFunction<typeof getServerSession>;
    getServerSessionMock.mockResolvedValueOnce({
      user: {
        name: 'jenna',
        email: 'jenna@jenna.com',
        image: '/path/to/image'
      },
    });

    const NavbarSync = await Navbar()

    const { container } = render(NavbarSync)

    const searchInput = await screen.findByRole('combobox');
    const userAccountButton = await screen.findByRole('button');
    const signInLink = screen.queryByRole('link', { name: 'Sign In' })

    expect(container).toMatchSnapshot();
    expect(searchInput).toBeInTheDocument();
    expect(userAccountButton).toBeInTheDocument();
    expect(signInLink).not.toBeInTheDocument();
  });
})