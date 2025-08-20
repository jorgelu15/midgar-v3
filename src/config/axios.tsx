import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL ?? "https://api-midgarsa.artosh.dev/api/v1",
    withCredentials: true
});

export default clienteAxios;