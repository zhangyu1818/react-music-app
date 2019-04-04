import axios, { AxiosRequestConfig } from 'axios';

const request = (
  url: string,
  options?: AxiosRequestConfig,
  defaultValue?: any
) => {
  return axios(`/api/music${url}`, options)
    .then(({ status, data }) => {
      if (status !== 200) throw new Error('数据获取失败');
      return data;
    })
    .catch(() => defaultValue || []);
};

export default request;
