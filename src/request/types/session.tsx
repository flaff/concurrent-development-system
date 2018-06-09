import {MessagePayload} from "@request/types/sockets";

export type GetAllMessagesPayload = {
    id: string;
};

export type GetAllMessagesResponse = {
    _id: string;
    Messages: Array<MessagePayload>;
    Name: string;
};
