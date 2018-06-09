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
};

export type GetSessionsResponse = Array<SessionRecord>;
