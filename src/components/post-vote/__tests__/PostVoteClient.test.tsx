import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import PostVoteClient from '../PostVoteClient';


const mockMutate = jest.fn();
const mockAxiosPatch = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(() => ({
    mutate: mockMutate,
  })),
}));

describe('PostVoteClient component', () => {
  it('renders upvoted post correctly', async () => {
    render(
      <PostVoteClient
        initialVote={'UP'}
        initialVoteCount={5}
        postId=""
      />,
    );
    const voutsCount = await screen.findByText("5");
    expect(voutsCount).toBeInTheDocument()

    const upvoteButton = await screen.findByRole("button", { name: 'Upvote' });
    const downvoteButton = await screen.findByRole("button", { name: 'Downvote' });
    const upvoteIcon = upvoteButton.querySelector('svg');
    const downvoteIcon = downvoteButton.querySelector('svg');
    expect(upvoteIcon).toHaveClass('text-emerald-500 fill-emerald-500');
    expect(upvoteIcon).not.toHaveClass('text-red-500 fill-red-500');
    expect(downvoteIcon).not.toHaveClass('text-emerald-500 fill-emerald-500');
    expect(downvoteIcon).not.toHaveClass('text-red-500 fill-red-500');
  });
  it('renders downvoted post correctly', async () => {
    render(
      <PostVoteClient
        initialVote={'DOWN'}
        initialVoteCount={-5}
        postId=""
      />,
    );
    const voutsCount = await screen.findByText("-5");
    expect(voutsCount).toBeInTheDocument()

    const upvoteButton = await screen.findByRole("button", { name: 'Upvote' });
    const downvoteButton = await screen.findByRole("button", { name: 'Downvote' });
    const upvoteIcon = upvoteButton.querySelector('svg');
    const downvoteIcon = downvoteButton.querySelector('svg');
    expect(upvoteIcon).not.toHaveClass('text-emerald-500 fill-emerald-500');
    expect(upvoteIcon).not.toHaveClass('text-red-500 fill-red-500');
    expect(downvoteIcon).not.toHaveClass('text-emerald-500 fill-emerald-500');
    expect(downvoteIcon).toHaveClass('text-red-500 fill-red-500');
  });
});
