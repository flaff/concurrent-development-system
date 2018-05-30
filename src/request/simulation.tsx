import socket from "@request/socket";
import {
    RotateSimulationPayload,
    RotatedSimulationPayload,
    SendMessagePayload,
    JoinedRoomPayload, JoinRoomPayload, MessagePayload, LeftRoomPayload
} from "@request/types/sockets";
import {SocketIMessage, SocketOMessage} from "@request/types/sockets/consts";
import axios from "axios";

const
    listeners = {},

    defineListener = (type: SocketOMessage) => {
        socket.on(type, (p) => listeners[type] && listeners[type](p));
    },

    createListenerSetter = function <T>(type: SocketOMessage) {
        return (listener: (p: T) => void) => listeners[type] = listener;
    };

defineListener(SocketOMessage.LEFT_ROOM);
defineListener(SocketOMessage.JOINED_ROOM);
defineListener(SocketOMessage.MESSAGE);
defineListener(SocketOMessage.ROTATED_SIMULATION);



export const
    EmitRotateSimulation = (payload: RotateSimulationPayload) => socket.emit(SocketIMessage.ROTATE_SIMULATION, payload),
    EmitMessage = (payload: SendMessagePayload) => socket.emit(SocketIMessage.SEND_MESSAGE, payload),
    EmitJoinRoom = (payload: JoinRoomPayload) => socket.emit(SocketIMessage.JOIN_ROOM, payload),
    EmitLeaveRoom = () => socket.emit(SocketIMessage.LEAVE_ROOM),

    OnRotatedSimulation = createListenerSetter<RotatedSimulationPayload>(SocketOMessage.ROTATED_SIMULATION),
    OnMessage = createListenerSetter<MessagePayload>(SocketOMessage.MESSAGE),
    OnJoinedRoom = createListenerSetter<JoinedRoomPayload>(SocketOMessage.JOINED_ROOM),
    OnLeftRoom = createListenerSetter<LeftRoomPayload>(SocketOMessage.LEFT_ROOM),

    GetSimulationFileByName = (fileNumber: string) => {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            if (token) {
                token = token.replace("\"", "");
            } else {
                reject("Token not found");
            }
            axios.get(`http://${window.location.hostname}:3001/api/simulation/${fileNumber}`, {
                headers: {"Authorize": token}
            }).then((response) => {
                resolve(response.data.fileData);
            }).catch((err) => {
                reject(err);
            });
        });
    };