import {AxiosPromise} from "axios";
import axios from "axios";
import {GetAllMessagesPayload, GetAllMessagesResponse} from "@request/types";

export const
    RequestAllMessages = (payload: GetAllMessagesPayload): AxiosPromise<GetAllMessagesResponse> =>
        axios.get(`http://${window.location.hostname}:3001/api/sessions/${payload.id}`);