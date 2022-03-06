import axios from "axios";


const product = axios.create({
    baseURL: 'http://localhost:8080/MobileAPI/api/'
  });

// Add a request interceptor
axios.interceptors.request.use(config => {
  // Do something before request is sent
  console.log("Before Request.");
  return config;
}, error => {
  // Do something with request error
  console.log("Before Error.",error);
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(response => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  console.log("Reponse Data.");
  return response;
}, error => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log("Reponse Error.",error);
  return Promise.reject(error);
});

export const getAllProductType = () => product.get(`/Product/GetAllProductType`);
export const getProductByType = (type = "") => product.get(`/Product/GetProductByType?type=${type}`);
export const getProductByID = (id) => product.get(`/Product/GetProductByID?id=${id}`);
export const getProductByIDs = (ids) => product.post(`/Product/GetProductByID`,ids);