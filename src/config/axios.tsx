import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL ?? "http://localhost:8000/api/v1",
    withCredentials: true
});

export default clienteAxios;