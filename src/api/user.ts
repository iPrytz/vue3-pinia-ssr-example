import Axios, { AxiosRequestConfig } from 'axios';

interface IResponse<T> {
  code: number;
  data: T;
  msg: string;
}

export interface IDBUser {
  name: string;
  userId: string;
  token: string;
}

export const getUserInfo = async (sessionId: string) => {
  const config: AxiosRequestConfig = { headers: { sessionId } };
  const { data } = await Axios.get<IResponse<IDBUser>>('http://localhost:8085/mock/getuserinfo', config);
  if (data.code === 0) {
    return data.data;
  }
  return null;
};