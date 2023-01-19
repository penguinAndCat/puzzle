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
      return res.data.friends;
    } catch (error) {
      throw new Error('error');
    }
  };

  return { puzzleFriend: data, refetchPuzzleFriend: refetch };
};

export const useNotice = (user: UserInfo | null) => {
  const { data, refetch } = useQuery(['notice'], () => getNotice(), {
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  const getNotice = async () => {
    try {
      if (user === null) return [];
      const res = await axios.get(`/api/users/notices`);
      return res.data.notice;
    } catch (error) {
      throw new Error('notice error');
    }
  };

  return { notice: data, refetchNotice: refetch };
};

export const useInvitedUser = (puzzleId: string | undefined | string[], user: UserInfo | null) => {
  const { data, refetch } = useQuery(['roomInfo-invitedUser'], () => getInvitedUser(), {
    onError: (error: Error) => {
      console.log(error);
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

  return { invitedUser: data, refetchInvitedUser: refetch };
};

export const useRoomInfo = (puzzleId: string | undefined | string[], user: UserInfo | null) => {
  const { data, refetch } = useQuery(['roomInfo'], () => getRoomInfo(), {
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  const getRoomInfo = async () => {
    try {
      if (puzzleId === undefined) return {};
      if (user === null) return { title: '', secretRoom: false, level: 1 };
      const res = await axios.get(`/api/puzzle/info/${puzzleId}`);
      return res.data.item;
    } catch (error) {
      throw new Error('roomInfo error');
    }
  };

  return { roomInfo: data, refetchRoomInfo: refetch };
};

export const usePopularPuzzle = () => {
  const { data, refetch } = useQuery(['popularPuzzle'], () => getPopularPuzzle(), {
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  const getPopularPuzzle = async () => {
    try {
      const res = await axios.get(`/api/puzzle/popular`);
      return res.data.puzzle;
    } catch (error) {
      throw new Error('popularPuzzle error');
    }
  };

  return { popularPuzzle: data, refetchPopularPuzzle: refetch };
};
