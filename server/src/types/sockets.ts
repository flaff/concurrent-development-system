export type JoinRoomPayload = {
    user: string;
    room: string;
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
};

export type MessagePayload = {
    content: string;
    type: MessageType;
    author: string;
    time: Date;
};
