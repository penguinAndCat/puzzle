/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'libs/axios';
import { useQuery } from 'react-query';

export const useInvitedUser = (puzzleId: string | undefined | string[], user: UserInfo | null) => {
  const { data, refetch } = useQuery(['roomInfo-invitedUser'], () => getInvitedUser(), {
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const getInvitedUser = async () => {
    try {
      if (puzzleId === undefined) return {};
      if (user === null) return {};
      const res = await axios.get(`/api/puzzle/users/${puzzleId}?userId=${user.id}`);
      return res.data.data;
    } catch (error) {
      throw new Error('error');
    }
  };

  return { data, refetch };
};
