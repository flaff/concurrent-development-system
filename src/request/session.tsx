import {AxiosPromise} from "axios";
import axios from "axios";
import {RestoreSessionPayload, RestoreSessionResponse} from "@request/types";

export const
    RequestAllMessages = (payload: RestoreSessionPayload): AxiosPromise<RestoreSessionResponse> =>
        axios.get(`http://${window.location.hostname}:3001/api/sessions/${payload.id}`);