import axios from 'libs/axios';
import { useQuery } from 'react-query';

export const usePuzzleFriend = (puzzleId: string | undefined | string[]) => {
  const { data, refetch } = useQuery(['puzzle-friend'], () => getPuzzleFriend(), {
    onError: (error: Error) => {
      console.log(error);
    },
  });

  const getPuzzleFriend = async () => {
    try {
      if (puzzleId === undefined) return [];
      const res = await axios.get(`/api/users/friends/${puzzleId}`);
      console.log(res.data.friends);
      return res.data.friends;
    } catch (error) {
      throw new Error('error');
    }
  };

  return { puzzleFriend: data, refetchPuzzleFriend: refetch };
};
