import axios from 'axios';
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setTokenToRequests(_accessToken: string) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${_accessToken}`;
}

const postRequest = (url: string, data: any) => {
  return instance.request({
    url,
    method: "POST",
    data,
  });
};

const getRequest = (url: string, params: any = {}) => {
  return instance.request({ url, method: "GET", params });
};

const deleteRequest = (url: string, data?: any) => {
  return instance.request({
    url,
    method: "DELETE",
    data,
  });
};

const putRequest = (url: string, data: any) => {
  return instance.request({
    url,
    method: "PUT",
    data,
  });
};

export { postRequest , getRequest , deleteRequest, putRequest };
