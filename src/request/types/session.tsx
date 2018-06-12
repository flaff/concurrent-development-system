import {MessagePayload} from "@request/types/sockets";

export type RestoreSessionPayload = {
    id: string;
};

export type RestoreSessionResponse = {
    _id: string;
    Messages: Array<MessagePayload>;
    Name: string;
    State?: {
        fileUrl?: string;
        x?: number;
        y?: number;
        autoPlay?: boolean;
    }
};
