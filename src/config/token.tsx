import clienteAxios from './axios';

const tokenAuth = (token: string) => {
    if (!token) {
        delete clienteAxios.defaults.headers.common['Authorization'];
        return;
    }

    clienteAxios.defaults.headers.common['Authorization'] = token;
}

export default tokenAuth;