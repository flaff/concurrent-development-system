import axios, {AxiosPromise} from 'axios';
import {
    LoginUserParams,
    LoginUserResponse,
    RegisterUserParams,
    RegisterUserResponse,
    RestoreUserParams,
    RestoreUserResponse
} from '@request/types';

export const
    RequestRegisterUser = (params: RegisterUserParams): AxiosPromise<RegisterUserResponse> =>
        axios.post(`http://${window.location.hostname}:3001/api/auth/register`, {
            login: params.login,
            password: params.password
        }),

    RequestLoginUser = (params: LoginUserParams): AxiosPromise<LoginUserResponse> =>
        axios.post(`http://${window.location.hostname}:3001/api/auth/login`, {
            login: params.login,
            password: params.password
        }),

    RequestRestoreUser = (params: RestoreUserParams): AxiosPromise<RestoreUserResponse> =>
        axios.get(`http://${window.location.hostname}:3001/api/auth/user`, {
            headers: {'Authorize': params.token.replace('"', '')}
        });
