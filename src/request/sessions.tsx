import {CreateSessionPayload, CreateSessionResponse} from "@request/types";
import {AxiosPromise} from "axios";
import axios from "axios";
import {GetSessionsResponse} from "@request/types/sessions";

export const
    RequestCreateSession = (params: CreateSessionPayload): AxiosPromise<CreateSessionResponse> =>
        axios.post(`http://${window.location.hostname}:3001/api/sessions`, {
            Name: params.Name
        }),

    RequestGetSessions = (): AxiosPromise<GetSessionsResponse> =>
        axios.get(`http://${window.location.hostname}:3001/api/sessions`);
