import axios from "axios";

axios.defaults.baseURL = `https://localhost:${process.env.REACT_APP_PORT}/api`;
axios.defaults.headers["Accept"] = "*/*";

axios.interceptors.request.use((request) => {
  // console.log("request", request);
  return request;
});

axios.interceptors.response.use(
  // SUCCESS
  (response) => {
    console.log("response", response);
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  // FAIL
  (error) => {
    // console.error("HTTP error", error.response);
    // return error.response;
    return Promise.reject(error);
  }
);

/**
 * DELETE request
 * @param {*} url
 * @param {*} axiosConfig
 * @returns
 */
const httpDelete = async (url: string, axiosConfig: any = {}) => {
  // console.log(url);
  const response = await axios
    .delete(url, axiosConfig)
    .catch((error) => console.error(url, error));

  return response;
};

/**
 * GET request
 * @param {*} url
 * @param {*} axiosConfig
 * @returns
 */
const httpGet = async (url: string, axiosConfig: any = {}) => {
  // console.log(url);
  const response = await axios
    .get(url, axiosConfig)
    .catch((error) => console.error(url, error));

  return response;
};

/**
 * PATCH request
 * @param {*} url
 * @param {*} data
 * @param {*} axiosConfig
 * @returns
 */
const httpPatch = async (url: any, data: any = {}, axiosConfig: any = {}) => {
  // console.log(url);
  const response = await axios
    .patch(url, data, axiosConfig)
    .catch((error) => console.error(url, error));

  return response;
};

/**
 * POST request
 * @param {*} url
 * @param {*} data
 * @param {*} axiosConfig
 * @returns
 */
const httpPost = async (url: any, data: any = {}, axiosConfig: any = {}) => {
  // console.log(url);
  const response = await axios
    .post(url, data, axiosConfig)
    .catch((error) => console.error(url, error));

  return response;
};

/**
 * PUT request
 * @param {*} url
 * @param {*} data
 * @param {*} axiosConfig
 * @returns
 */
const httpPut = async (url: any, data: any = {}, axiosConfig: any = {}) => {
  // console.log(url);
  const response = await axios
    .put(url, data, axiosConfig)
    .catch((error) => console.error(url, error));

  return response;
};

//-----------------------------------------//
const httpService = {
  get: httpGet,
  put: httpPut,
  patch: httpPatch,
  post: httpPost,
  delete: httpDelete,
};
export default httpService;
//-----------------------------------------//
