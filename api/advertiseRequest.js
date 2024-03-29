import axios from "axios";


const advertise = axios.create({
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

export const getAdvertiseCarouselType = (type = "") => advertise.get(`/Advertise/GetImagesByType?Type=${type}`);

