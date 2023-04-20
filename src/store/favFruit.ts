import { getFavoriteFruitList, getFavoriteColor } from '@/api/favFruit';
import { defineStore } from 'pinia';
import { useUser } from './user';

export interface IMarketState {
  fruitUserName: string;
  fruitList: string[];
  colorUserName: string;
  color: string;
}

export const favFruit = defineStore('favFruit', {
  state(): IMarketState {
    return {
      fruitUserName: '',
      fruitList: [],
      colorUserName: '',
      color: ''
    };
  },
  actions: {
    async getList() {
      try {
        const requestLogId = new Date().getTime() + '-' + Math.random().toString(36).slice(-5);
        console.log(requestLogId, 1, 'sessionId:', useUser().sessionId);

        const fruitData = await getFavoriteFruitList(requestLogId);
        if (fruitData) {
          this.fruitUserName = fruitData.user;
          this.fruitList = fruitData.fruitList;
        }
        console.log(requestLogId, 3, 'sessionId:', useUser().sessionId);

        const colorData = await getFavoriteColor(requestLogId);
        if (colorData) {
          this.colorUserName = colorData.user;
          this.color = colorData.color;
        }
        console.log(requestLogId, 5, 'sessionId:', useUser().sessionId);

      } catch (error: any) {
        console.log('fav fruit error', error.message);
      }
    }
  }
});
