import {USER_LOGIN, USER_LOGOUT, USER_REGISTER, USER_RESTORE} from "@state/constants/user";
import {RequestLoginUser, RequestRegisterUser, RequestRestoreUser} from "@request/user";
import {LoginUserParams, RegisterUserParams, RestoreUserParams} from "@request/types";

export const
    loginUser = dispatch => (params: LoginUserParams) => {
        dispatch(USER_LOGIN.START());
        RequestLoginUser(params)
            .then(response => response.data)
            .then(data => dispatch(USER_LOGIN.SUCCESS(data)))
            .catch(error => dispatch(USER_LOGIN.ERROR(error)));
    },

    registerUser = dispatch => (params: RegisterUserParams) => {
        dispatch(USER_REGISTER.START());
        RequestRegisterUser(params)
            .then(response => response.data)
            .then(data => dispatch(USER_REGISTER.SUCCESS(data)))
            .catch(error => dispatch(USER_REGISTER.ERROR(error)));
    },

    restoreUser = dispatch => (params: RestoreUserParams) => {
        dispatch(USER_RESTORE.START());
        RequestRestoreUser(params)
            .then(response => response.data)
            .then(data => dispatch(USER_RESTORE.SUCCESS(data)))
            .catch(error => dispatch(USER_RESTORE.ERROR(error)));
    },

    logoutUser = dispatch =>
        () => dispatch(USER_LOGOUT());
