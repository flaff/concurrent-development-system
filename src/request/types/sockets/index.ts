import socket from "@request/socket";
import {SocketOMessage} from "@request/types/sockets/consts";

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
    author: string;
    type: MessageType;
    room: string;
};

export type MessagePayload = {
    content: string;
    type: MessageType;
    author: string;
    time: number;
};

const listeners = {};

export const
    defineSocketListener = (type: SocketOMessage) => {
        socket.on(type, (p) => listeners[type] && listeners[type](p));
    },

    createSocketListenerSetter = function <T>(type: SocketOMessage) {
        return (listener: (p: T) => void) => listeners[type] = listener;
    };
