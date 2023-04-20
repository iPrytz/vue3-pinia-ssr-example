import { getUserInfo } from '@/api/user';
import { defineStore } from 'pinia';

interface IUser {
  name: string;
  userId: string;
  token: string;
}
export interface IUserState {
  userInfo: IUser;
  sessionId: string;
}

export const useUser = defineStore('user', {
  state(): IUserState {
    return {
      userInfo: {
        name: '',
        userId: '',
        token: ''
      },
      sessionId: ''
    };
  },
  actions: {
    updateUser(info: IUser) {
      this.userInfo = info;
    },
    updateToken(token: string) {
      this.userInfo.token = token;
    },
    updateSessionId(sessionId: string) {
      if(sessionId) {
        this.sessionId = sessionId.replace('sessionId=', '');
      }
    },
    async getToken() {
      if(this.sessionId) {
        if (!this.userInfo.token) {
          try {
            const userData = await getUserInfo(this.sessionId);
            if(userData) {
              this.userInfo = userData;
            }
          } catch (error: any) {
            console.log('user error', error.message);
          }
        }

        return this.userInfo.token;

      } else {
        return 'anonymous-token';
      }
    }
  }
});
