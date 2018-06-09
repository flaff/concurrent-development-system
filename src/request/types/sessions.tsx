export type CreateSessionPayload = {
    Name: string;
};

export type CreateSessionResponse = {
    _id: string;
};

export type SessionRecord = {
    Name: string;
    _id: string;
    CreateDate: number;
    Messages: Array<any>;
};

export type GetSessionsResponse = Array<SessionRecord>;
