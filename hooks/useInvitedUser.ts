/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'libs/axios';
import { useQuery } from 'react-query';

export const useInvitedUser = (id: string | undefined | string[]) => {
  const { data, refetch } = useQuery(['roomInfo-invitedUser'], () => getInvitedUser(), {
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const getInvitedUser = async () => {
    try {
      if (id === undefined) return {};
      const res = await axios.get(`/api/puzzle/users/${id}`);
      return res.data.item;
    } catch (error) {
      throw new Error('error');
    }
  };

  return { data, refetch };
};
