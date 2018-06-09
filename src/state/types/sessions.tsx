import {SessionRecord} from "@request/types/sessions";

export type SessionsState = {
    list: Array<SessionRecord>;
    shouldRefresh: boolean;
};
