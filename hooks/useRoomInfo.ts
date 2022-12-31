import axios from 'libs/axios';
import { useQuery } from 'react-query';

export const useRoomInfo = (puzzleId: string | undefined | string[], user: UserInfo | null) => {
  const { data, refetch } = useQuery(['roomInfo'], () => getRoomInfo(), {
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  const getRoomInfo = async () => {
    try {
      if (user === null) return { title: '', secretRoom: false, level: 1 };
      const res = await axios.get(`/api/puzzle/info/${puzzleId}`);
      return res.data.item;
    } catch (error) {
      throw new Error('roomInfo error');
    }
  };

  return { roomInfo: data, refetchRoomInfo: refetch };
};
