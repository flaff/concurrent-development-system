export type CreateSessionPayload = {
    name: string;
};

export type CreateSessionResponse = {
    id: string;
};

export type SessionRecord = {
    name: string;
    id: string;
};

export type GetSessionsResponse = Array<SessionRecord>;
