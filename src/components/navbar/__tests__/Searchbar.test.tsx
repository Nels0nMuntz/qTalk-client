import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { useQuery } from "@tanstack/react-query";
import Searchbar from "../Searchbar";
import { SearchResult } from "@/types";

// const pushMock = jest.fn();
// const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: {},
    refetch: jest.fn(),
    isFetched: false,
  })), 
}));

jest.mock('axios', () => ({}));


describe('Searchbar component', () => {
  it('does not render listbox until type any value', async () => {
    const { container } = render(<Searchbar/>);

    const input = await screen.findByRole('combobox');
    const listbox = screen.queryByRole('listbox');

    expect(input).toHaveValue('');
    expect(listbox).not.toBeInTheDocument();
    // expect(container).toMatchSnapshot();
  });
  it('renders listbox after a value was provided', async () => {
    const getServerSessionMock = useQuery as jest.MockedFunction<typeof useQuery<SearchResult>>;
    getServerSessionMock.mockResolvedValueOnce();
    const { container } = render(<Searchbar/>);

    const input = await screen.findByRole('combobox');
    const listbox = await screen.findByRole('listbox');

    await user.type(input, 'react');

    expect(input).toHaveValue('react');
    expect(listbox).toBeInTheDocument();
    // expect(container).toMatchSnapshot();
  });
})