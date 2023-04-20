import { useUser } from '@/store/user';
import Axios, { AxiosRequestConfig } from 'axios';

interface IResponse<T> {
  code: number;
  data: T;
  msg: string;
}
export interface IFavFruitItems {
  user: string;
  fruitList: string[];
}
export interface IFavColor {
  user: string;
  color: string;
}

export const getFavoriteFruitList = async (requestLogId: string) => {
  const token = await useUser().getToken();
  console.log(requestLogId, 2, token);
  const config: AxiosRequestConfig = { headers: { token } };
  const { data } = await Axios.get<IResponse<IFavFruitItems>>('http://localhost:8085/mock/getfavoritefruitlist', config);
  if (data.code === 0) {
    return data.data;
  }
  return null;
};

export const getFavoriteColor = async (requestLogId: string) => {
  const token = await useUser().getToken();
  console.log(requestLogId, 4, token);
  const config: AxiosRequestConfig = { headers: { token } };
  const { data } = await Axios.get<IResponse<IFavColor>>('http://localhost:8085/mock/getfavoritecolor', config);
  if (data.code === 0) {
    return data.data;
  }
  return null;
};