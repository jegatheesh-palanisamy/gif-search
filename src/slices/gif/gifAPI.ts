import axios from "axios";

export const searchGifsAPI = (searchTerm: string, offset: number, limit: number) => axios({
  method: 'GET',
  url: `/search?q=${searchTerm}&limit=${limit}&offset=${offset}&rating=g&lang=en`
});

export const fetchTrendingGifsAPI = (offset: number, limit: number) => axios({
  method: 'GET',
  url: `/trending?limit=${limit}&offset=${offset}&rating=g&lang=en`
});
