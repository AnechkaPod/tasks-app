import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7100/api',
});

export default API;