import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { usePostVotes } from '../usePostVotes';
import { VoteType } from '@prisma/client';

const queryClient = new QueryClient();
const Wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockAxiosPatch = jest.fn();
jest.spyOn(axios, 'patch').mockImplementation(mockAxiosPatch);

describe('usePostVotes hook', () => {
  it('makes api call correctly', async () => {
    const initialProps = {
      initialVote: null,
      initialVoteCount: 0,
      postId: '1',
    };
    const { result, rerender } = renderHook(() => usePostVotes(initialProps), {
      wrapper: Wrapper,
    });
    const { upvote } = result.current;

    await waitFor(() => upvote());

    expect(mockAxiosPatch).toHaveBeenCalledWith('/api/subtalk/post/vote', {
      postId: initialProps.postId,
      voteType: 'UP',
    });
    rerender()
  });
  it('should add the positive vote when upvote is called', async () => {
    const initialProps = {
      initialVote: null,
      initialVoteCount: 0,
      postId: '1',
    };
    const { result } = renderHook(() => usePostVotes(initialProps), {
      wrapper: Wrapper,
    });
    const { upvote, currentVote, votesCount } = result.current;

    expect(currentVote).toBe(initialProps.initialVote);
    expect(votesCount).toBe(initialProps.initialVoteCount);

    await waitFor(() => upvote());

    expect(result.current.votesCount).toBe(1);
    expect(result.current.currentVote).toBe('UP');
  });
  it('should remove the positive vote when upvote is called second time', async () => {
    const initialProps = {
      initialVote: null,
      initialVoteCount: 0,
      postId: '1',
    };
    const {result} = renderHook(() => usePostVotes(initialProps), {
      wrapper: Wrapper,
    });
    const { upvote, currentVote, votesCount } = result.current;

    expect(currentVote).toBe(initialProps.initialVote);
    expect(votesCount).toBe(initialProps.initialVoteCount);    

    await waitFor(() => upvote());
    await waitFor(() => upvote());

    expect(currentVote).toBe(initialProps.initialVote);
    expect(votesCount).toBe(initialProps.initialVoteCount);
  });
  it('should add the negative vote when downvote is called', async () => {
    const initialProps = {
      initialVote: null,
      initialVoteCount: 0,
      postId: '1',
    };
    const { result } = renderHook(() => usePostVotes(initialProps), {
      wrapper: Wrapper,
    });
    const { downvote, currentVote, votesCount } = result.current;

    expect(currentVote).toBe(initialProps.initialVote);
    expect(votesCount).toBe(initialProps.initialVoteCount);

    await waitFor(() => downvote());

    expect(result.current.votesCount).toBe(-1);
    expect(result.current.currentVote).toBe('DOWN');
  });
  it('should remove the negative vote when downvote is called second time', async () => {
    const initialProps = {
      initialVote: null,
      initialVoteCount: 0,
      postId: '1',
    };
    const {result} = renderHook(() => usePostVotes(initialProps), {
      wrapper: Wrapper,
    });
    const { upvote, currentVote, votesCount } = result.current;

    expect(currentVote).toBe(initialProps.initialVote);
    expect(votesCount).toBe(initialProps.initialVoteCount);    

    await waitFor(() => upvote());
    await waitFor(() => upvote());

    expect(currentVote).toBe(initialProps.initialVote);
    expect(votesCount).toBe(initialProps.initialVoteCount);    
  });
});
