import axios from './axios';

class FriendAPI {
  /**
   * 친구 목록 조회
   */
  public async getFriend() {
    try {
      const response = await axios.get(`/api/users/friends`);
      return response.data.friends;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 친구 요청
   * @param requester 요청자 아이디
   * @param requestedNickname 요청 보낼 닉네임
   */
  public async requestFriend(requester: string, requestedNickname: string) {
    try {
      const response = await axios.post(`/api/users/friends`, {
        data: {
          requester: requester,
          requestedNickname: requestedNickname,
        },
      });
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 친구 요청 수락
   * @param requester 요청자 아이디
   * @param friendNickname 친구 요청 보낸 닉네임
   */
  public async acceptFriend(requester: string, friendNickname: string) {
    try {
      const response = await axios.put(`/api/users/friends`, {
        data: {
          userId: requester,
          friendNickname: friendNickname,
        },
      });
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 친구 요청 거절
   * @param requester 요청자 아이디
   * @param friendNickname 친구 요청 보낸 닉네임
   */
  public async rejectFriend(requester: string, friendNickname: string) {
    try {
      const response = await axios.delete(`/api/users/friends`, {
        params: {
          userId: requester,
          friendNickname: friendNickname,
        },
      });
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 친구 삭제
   * @param requester 요청자 아이디
   * @param friendNickname 삭제할 친구 닉네임
   */
  public async deleteFriend(requester: string, friendNickname: string) {
    try {
      const response = await axios.delete(`/api/users/friends/${requester}`, {
        params: { friendNickname: friendNickname },
      });
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new FriendAPI();
