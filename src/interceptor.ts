import axios from "axios";

export const setupInterceptors = () => {
  axios.defaults.baseURL = process.env.REACT_APP_GIPHY_API_URL;
  axios.interceptors.request.use((config) => {
    try {
      config.url = config.url + (config.url?.includes('?') ? '' : '?') + `&api_key=${process.env.REACT_APP_GIPHY_API_KEY}`;

    } catch (e) {
      console.error(e);
    }
    return config;
  });
}
