import socket from '@request/socket';
import {
    RotateSimulationPayload,
    RotatedSimulationPayload,
    SendMessagePayload,
    JoinedRoomPayload,
    JoinRoomPayload,
    MessagePayload,
    LeftRoomPayload,
    defineSocketListener,
    createSocketListenerSetter
} from '@request/types/sockets';
import {SocketIMessage, SocketOMessage} from '@request/types/sockets/consts';
import axios from 'axios';


defineSocketListener(SocketOMessage.LEFT_ROOM);
defineSocketListener(SocketOMessage.JOINED_ROOM);
defineSocketListener(SocketOMessage.MESSAGE);
defineSocketListener(SocketOMessage.ROTATED_SIMULATION);
defineSocketListener(SocketOMessage.SESSION_LIST_REFRESH);

const emitWithSession = (socketMessage: string, payload?: any) => {
    let splitedHref = location.href.split('/');
    payload.sessionId = splitedHref[splitedHref.length - 1];
    socket.emit(socketMessage, payload);
};

export const
    EmitRotateSimulation = (payload: RotateSimulationPayload) => emitWithSession(SocketIMessage.ROTATE_SIMULATION, payload),
    EmitMessage = (payload: SendMessagePayload) => emitWithSession(SocketIMessage.SEND_MESSAGE, payload),
    EmitJoinRoom = (payload: JoinRoomPayload) => emitWithSession(SocketIMessage.JOIN_ROOM, payload),
    EmitLeaveRoom = (payload: any) => socket.emit(SocketIMessage.LEAVE_ROOM, payload),

    OnRotatedSimulation = createSocketListenerSetter<RotatedSimulationPayload>(SocketOMessage.ROTATED_SIMULATION),
    OnMessage = createSocketListenerSetter<MessagePayload>(SocketOMessage.MESSAGE),
    OnJoinedRoom = createSocketListenerSetter<JoinedRoomPayload>(SocketOMessage.JOINED_ROOM),
    OnLeftRoom = createSocketListenerSetter<LeftRoomPayload>(SocketOMessage.LEFT_ROOM),

    GetSimulationFileByName = (fileNumber: string) => {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem('token');
            if (token) {
                token = token.replace('"', '');
            } else {
                reject('Token not found');
            }
            axios.get(`http://${window.location.hostname}:3001/api/simulation/${fileNumber}`, {
                headers: {'Authorize': token}
            }).then((response) => {
                resolve(response.data.fileData);
            }).catch((err) => {
                reject(err);
            });
        });
    };