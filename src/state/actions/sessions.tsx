import {CREATE_SESSION, GET_SESSIONS} from "@state/constants/sessions";
import {CreateSessionPayload} from "@request/types";
import {RequestCreateSession, RequestGetSessions} from "@request/sessions";

export const
    createSession = (dispatch) => (params: CreateSessionPayload) => {
        dispatch(CREATE_SESSION.START());
        RequestCreateSession(params)
            .then((response) => dispatch(CREATE_SESSION.SUCCESS(response.data)))
            .catch((error) => dispatch(CREATE_SESSION.ERROR(error)))
    },

    getSessions = (dispatch) => () => {
        dispatch(GET_SESSIONS.START());
        RequestGetSessions()
            .then((response) => dispatch(GET_SESSIONS.SUCCESS(response.data)))
            .catch((error) => dispatch(GET_SESSIONS.ERROR(error)))
    };
