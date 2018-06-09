import {USER_LOGIN, USER_LOGOUT, USER_REGISTER, USER_RESTORE} from '@state/constants/user';
import {RequestLoginUser, RequestRegisterUser, RequestRestoreUser} from '@request/user';
import {LoginUserParams, RegisterUserParams, RestoreUserParams} from '@request/types';
import {ToastrService} from '../../toastr.helper';

export const
    loginUser = dispatch => (params: LoginUserParams) => {
        dispatch(USER_LOGIN.START());
        RequestLoginUser(params)
            .then(response => response.data)
            .then(data => {
                ToastrService.success('Login sucess!', 'You have been logged in successfully');
                dispatch(USER_LOGIN.SUCCESS(data));
            })
            .catch(error => {
                ToastrService.error('Login error!', error.response.data.err);
                dispatch(USER_LOGIN.ERROR(error));
            });
    },

    registerUser = dispatch => (params: RegisterUserParams) => {
        dispatch(USER_REGISTER.START());
        RequestRegisterUser(params)
            .then(response => response.data)
            .then(data => {
                ToastrService.success('Register sucess!', 'You have been registered in successfully');
                dispatch(USER_REGISTER.SUCCESS(data));
            })
            .catch(error => {
                ToastrService.error('Register error!', error.response.data.err);
                dispatch(USER_REGISTER.ERROR(error));
            });
    },

    restoreUser = dispatch => (params: RestoreUserParams) => {
        dispatch(USER_RESTORE.START());
        RequestRestoreUser(params)
            .then(response => response.data)
            .then(data => {
                ToastrService.success('Restore session sucess!', 'Your session have been restored in successfully');
                dispatch(USER_RESTORE.SUCCESS(data));
            })
            .catch(error => dispatch(USER_RESTORE.ERROR(error)));
    },

    logoutUser = dispatch =>
        () => {
            ToastrService.warning('Logout sucess!', 'You have been logged out successfully');
            dispatch(USER_LOGOUT());
        };
