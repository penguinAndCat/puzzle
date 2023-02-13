import { NEXT_SERVER } from 'config';
import axios from './axios';

class PuzzleAPI {
  /**
   * 퍼즐 방 정보
   * @param puzzleId 퍼즐 아이디
   */
  public async getPuzzle(puzzleId: string | string[] | undefined) {
    try {
      const response = await axios.get(`/api/puzzle/${puzzleId}`);
      return response.data.item;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 퍼즐 목록 조회
   * @param pageParam 페이지 수
   * @param sortField 정렬 기준
   * @param sortType 정렬 방식
   * @param showPerfect 완성 작품 보이기 여부
   * @param searchKeyword 조회 키워드
   * @param searchField 조회 분야
   */
  public async getPuzzleList(
    pageParam: number,
    sortField: 'createdAt' | 'perfection',
    sortType: 'desc' | 'asc',
    showPerfect: boolean,
    searchKeyword: string = 'false',
    searchField: string = 'secretRoom'
  ) {
    try {
      const response = await axios.get(`${NEXT_SERVER}/api/puzzle`, {
        params: {
          page: pageParam,
          sortField: sortField,
          sortType: sortType,
          showPerfect: showPerfect,
          searchKeyword: searchKeyword,
          searchField: searchField,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 인기 퍼즐 목록 조회
   */
  public async getPopularPuzzleList() {
    try {
      const response = await axios.get(`${NEXT_SERVER}/api/puzzle/popular`);
      return response.data.puzzle;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 퍼즐 생성
   * @param data 퍼즐 정보
   */
  public async createPuzzle(data: {
    config: Config;
    userId: string | undefined;
    level: number;
    title: string;
    secretRoom: boolean;
    maximumPlayer: number;
    perfection: number;
  }) {
    try {
      const response = await axios.post('/api/puzzle', {
        data: data,
      });
      return response.data.item;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 퍼즐방 초대 요청 거절
   * @param requester 요청자 아이디
   * @param puzzleId 퍼즐방 아이디
   */
  public async deletePuzzle(id: string) {
    try {
      const response = await axios.delete(`/api/puzzle/${id}`);
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 타일 집었을 때 퍼즐 정보 전송
   * @param puzzleId 퍼즐 아이디
   * @param data 퍼즐 정보
   */
  public async grabTiles(
    puzzleId: string | string[],
    data: {
      groupTiles: any[][];
      canvasSize: size;
      socketId: any;
    }
  ) {
    axios
      .post(`/api/puzzle/${puzzleId}`, {
        data,
      })
      .then((res) => {
        if (res.data.message !== 'success') alert('통신이 불안정합니다. 다시 시도해주세요.');
      })
      .catch(function (error) {
        console.log(error);
        alert('통신이 불안정합니다. 다시 시도해주세요.');
      });
  }

  /**
   * 타일 이동 시 퍼즐 정보 전송
   * @param puzzleId 퍼즐 아이디
   * @param data 퍼즐 정보
   */
  public async moveTiles(
    puzzleId: string | string[],
    data: {
      groupTiles: any[][];
      canvasSize: size;
      indexArr: number[];
      socketId: any;
      perfection: number;
    }
  ) {
    axios
      .put(`/api/puzzle/${puzzleId}`, {
        data,
      })
      .then((res) => {
        if (res.data.message !== 'success') alert('통신이 불안정합니다. 다시 시도해주세요.');
      })
      .catch(function (error) {
        console.log(error);
        alert('통신이 불안정합니다. 다시 시도해주세요.');
      });
  }

  /**
   * 퍼즐방 초대 요청
   * @param requester 요청자 아이디
   * @param requestedNickname 요청 보낼 닉네임
   * @param puzzleId 퍼즐방 아이디
   */
  public async requestInvitation(
    requester: string,
    requestedNickname: string,
    puzzleId: string | string[] | undefined
  ) {
    try {
      const response = await axios.post(`/api/users/puzzle`, {
        data: {
          requester: requester,
          requestedNickname: requestedNickname,
          puzzleId: puzzleId,
        },
      });
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 퍼즐방 초대 요청 수락
   * @param requester 요청자 아이디
   * @param puzzleId 퍼즐방 아이디
   */
  public async acceptInvitation(requester: string, puzzleId: string | undefined) {
    try {
      const response = await axios.put(`/api/users/puzzle`, {
        data: {
          userId: requester,
          puzzleId: puzzleId,
        },
      });
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 퍼즐방 초대 요청 거절
   * @param requester 요청자 아이디
   * @param puzzleId 퍼즐방 아이디
   */
  public async rejectInvitation(requester: string, puzzleId: string) {
    try {
      const response = await axios.delete(`/api/users/puzzle`, {
        params: {
          userId: requester,
          puzzleId: puzzleId,
        },
      });
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 퍼즐방 초대 요청 수락
   * @param requester 요청자 아이디
   * @param puzzleId 퍼즐방 아이디
   */
  public async getRoomInfo(id: string | string[] | undefined) {
    try {
      const response = await axios.get(`${NEXT_SERVER}/api/puzzle/info/${id}`);
      return response.data.item;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new PuzzleAPI();
