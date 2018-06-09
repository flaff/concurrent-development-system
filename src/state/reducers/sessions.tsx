import {SessionsState} from "@state/types/sessions";
import {GET_SESSIONS, SESSION_REFRESH} from "@state/constants/sessions";
import {IAction} from "@state/constants/generic";
import {GetSessionsResponse} from "@request/types/sessions";

const
    defaultState: SessionsState = {
        list: [],
        shouldRefresh: false
    },

    getSessionsSuccessReducer = (state: SessionsState, action: IAction<GetSessionsResponse>): SessionsState => ({
        ...state,
        list: action.payload,
        shouldRefresh: false
    }),

    sessionRefreshReducer = (state: SessionsState): SessionsState => ({
        ...state,
        shouldRefresh: true
    });

export default function sessionsReducer(state: SessionsState, action: any) {
    switch (action.type) {
        case SESSION_REFRESH.type:
            return sessionRefreshReducer(state);

        case GET_SESSIONS.SUCCESS.type:
            return getSessionsSuccessReducer(state, action);

        default:
            return state || defaultState;
    }
}
