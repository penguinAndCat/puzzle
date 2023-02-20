import axios from './axios';
import { NEXT_SERVER } from 'config';

class UserAPI {
  /**
   * 인증 정보 받아오기
   * @param cookie 쿠키 정보
   */
  public async getAuth(cookie: any) {
    try {
      const response = await axios.get(`${NEXT_SERVER}/api/auth`, {
        headers: {
          Cookie: cookie || '',
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 로그아웃
   */
  public async logout() {
    try {
      await axios.delete('/api/auth');
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 프로필 변경
   * @param data 프로필 정보
   */
  public async updateProfile(data: any) {
    try {
      const response = await axios.put('/api/users', data);
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 유저 찾기
   * @param searched 찾는 사람 닉네임
   */
  public async searchUser(searched: string) {
    try {
      const response = await axios.get(`/api/users/${searched}`);
      return response.data.user;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserAPI();
