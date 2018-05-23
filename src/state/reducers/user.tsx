import {UserState} from "@state/types/user";
import {IAction} from "@state/constants/generic";
import {USER_LOGIN, USER_LOGOUT, USER_REGISTER, USER_RESTORE} from "@state/constants/user";
import {LoginUserResponse, RegisterUserResponse, RestoreUserResponse} from "@request/types";

const
    setToken = (token: string) => {
        token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
        return token || "";
    },

    defaultState = {
        token: localStorage.getItem("token") || ""
    },

    userLoginSuccess = (state: UserState, action: IAction<LoginUserResponse>): UserState => ({
        ...state,
        token: setToken(action.payload.token),
        id: action.payload.userProfile.Id,
        name: action.payload.userProfile.Login,
        authorized: true
    }),

    userRestoreSuccess = (state: UserState, action: IAction<RestoreUserResponse>): UserState => ({
        ...state,
        id: action.payload.userProfile.Id,
        name: action.payload.userProfile.Login,
        authorized: true
    }),

    userLogout = (state: UserState): UserState => ({
        ...state,
        token: setToken(""),
        id: "",
        name: "",
        authorized: false
    });

export default function userReducer(state: UserState, action): UserState {
    switch (action.type) {
        case USER_LOGIN.SUCCESS.type:
            return userLoginSuccess(state, action);

        case USER_RESTORE.SUCCESS.type:
            return userRestoreSuccess(state, action);

        case USER_LOGOUT.type:
            return userLogout(state);

        default:
            return state || defaultState;
    }
}