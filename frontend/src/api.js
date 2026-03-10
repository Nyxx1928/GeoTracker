import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    withCredentials: true, //important for cookies
    xsrfCookieName: 'XSRF-TOKEN', //default are fine but explicit is ok
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

export default api;