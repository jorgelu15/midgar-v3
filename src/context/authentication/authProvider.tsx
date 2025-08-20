import React, { useReducer } from 'react';
import api from "../../config/axios";

import AuthContext from './authContext';
import AuthReducer from './authReducer';

const typeState = {
    LOGIN_EXITOSO: 'LOGIN_EXITOSO',
    LOGIN_ERROR: 'LOGIN_ERROR',
    REGISTRO_EXITOSO: 'REGISTRO_EXITOSO',
    REGISTRO_ERROR: 'REGISTRO_ERROR',
    USUARIO_AUTENTICADO: 'USUARIO_AUTENTICADO',
    CERRAR_SESION: 'CERRAR_SESION',
}

interface Usuario {
    email: string;
    alias: string;
    password: string;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        usuario: null,
        msg: null,
        cargando: true
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    const signIn = async (email: string, password: string) => {
        const res = await api.post('/authenticate/signin', {
            email,
            password
        }, {
            withCredentials: true,
        });

        dispatch({
            type: typeState.LOGIN_EXITOSO,
            payload: res.data
        });

        return res;
    }

    const signUp = async (datos: Usuario) => {
        try {
            const res = await api.post(`/authenticate/register`, datos);

            return res;
        } catch (error) {

            dispatch({
                type: typeState.REGISTRO_ERROR,
                payload: error
            })
        }
    }

    const enableMFA = async (codigo: any) => {
        try {
            const res = await api.get(`/authenticate/enableMFA/${codigo}`);
            return res.data.data;
        } catch (error) {
            dispatch({
                type: typeState.REGISTRO_ERROR,
                payload: error
            })
        }
    }

    const verifyMFA = async (codigo: string, userId: string) => {
        const res = await api.post(`/authenticate`, {
            params: {
                codigoMFA: codigo,
                userId: userId
            }
        }, {
            withCredentials: true
        });


        return res;

    }

    const usuarioAutenticado = async () => {
        try {
            const res = await api.get('/authenticate', {
                withCredentials: true
            });


            dispatch({
                type: typeState.USUARIO_AUTENTICADO,
                payload: res.data.data
            })

        } catch (error) {
            logOut();
        }
    }

    const logOut = async () => {
        try {
            await api.post('/authenticate/logout', null, {
                withCredentials: true
            });

            

            dispatch({
                type: typeState.CERRAR_SESION
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                usuario: state.usuario,
                msg: state.msg,
                cargando: state.cargando,
                signIn,
                signUp,
                enableMFA,
                verifyMFA,
                usuarioAutenticado,
                logOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;