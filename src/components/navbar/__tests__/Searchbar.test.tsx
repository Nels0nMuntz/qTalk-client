import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import * as ReactQuery from '@tanstack/react-query';
import Searchbar from '../Searchbar';

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
    const { container } = render(<Searchbar />);

    const input = await screen.findByRole('combobox');
    const listbox = screen.queryByRole('listbox');

    expect(input).toHaveValue('');
    expect(listbox).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it('renders listbox after a value was provided', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: [
          {
            createdAt: '2023-10-30T08:59:23.604Z',
            creatorId: 'clocm8wdm0000w6go6r0c522c',
            id: 'cloco52l00001ia08m7l5xrwi',
            name: 'Reactjs',
            updatedAt: '2023-10-30T08:59:23.604Z',
            _count: {
              posts: 2,
              subscribers: 2,
            },
          },
        ],
      }),
    );
    const { container } = render(<Searchbar />);

    const input = await screen.findByRole('combobox');
    await user.type(input, 'react');

    expect(input).toHaveValue('react');

    const listbox = await screen.findByRole('listbox');
    
    expect(listbox).toBeInTheDocument();
    expect(container).toMatchSnapshot();

    const option = await screen.findByText('t/Reactjs')
    expect(option).toBeInTheDocument();
  });
  it('renders empty listbox if nothing was found', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: [],
        refetch: jest.fn(),
        isFetched: true,
      }),
    );
    const { container } = render(<Searchbar />);

    const input = await screen.findByRole('combobox');
    await user.type(input, 'some string');

    expect(input).toHaveValue('some string');

    const listbox = await screen.findByRole('listbox');
    
    expect(listbox).toBeInTheDocument();
    screen.debug(listbox)
    expect(container).toMatchSnapshot();

    const block = await screen.findByText('No results found.');
    expect(block).toBeInTheDocument();
  });
});
