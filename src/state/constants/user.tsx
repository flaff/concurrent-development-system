import {createActionCreator, createGenericRequestConsts} from "@state/constants/generic";
import {LoginUserResponse, RegisterUserResponse, RestoreUserResponse} from "@request/types/user";

export const
    USER_LOGIN = createGenericRequestConsts<LoginUserResponse>('USER_LOGIN'),
    USER_RESTORE = createGenericRequestConsts<RestoreUserResponse>('USER_RESTORE'),
    USER_REGISTER = createGenericRequestConsts<RegisterUserResponse>('USER_REGISTER'),
    USER_LOGOUT = createActionCreator('USER_LOGOUT');