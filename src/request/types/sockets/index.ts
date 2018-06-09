export type JoinRoomPayload = {
    user: string;
    room: string;
    sessionName: string;
    sessionId: string;
};

export type JoinedRoomPayload = {
    user: string;
};

export type LeftRoomPayload = JoinRoomPayload;

export type RotateSimulationPayload = {
    x: number;
    y: number;
};

export type RotatedSimulationPayload = RotateSimulationPayload;

export const enum MessageType {
    TEXT = 'TEXT',
    BASE64IMAGE = 'BASE64IMAGE'
}

export type SendMessagePayload = {
    content: string;
    type: MessageType;
    room: string;
};

export type MessagePayload = {
    content: string;
    type: MessageType;
    author: string;
    time: number;
};
