import {createActionCreator, createGenericRequestConsts} from "@state/constants/generic";
import {CreateSessionResponse, GetSessionsResponse} from "@request/types";

export const
    CREATE_SESSION = createGenericRequestConsts<CreateSessionResponse>('CREATE_SESSION'),
    GET_SESSIONS = createGenericRequestConsts<GetSessionsResponse>('GET_SESSIONS'),
    SESSION_REFRESH = createActionCreator('SESSION_REFRESH');
