import socketIO, {Server, Socket} from 'socket.io';
import {SocketIMessage, SocketOMessage} from '../types/consts';
import {
    JoinedRoomPayload,
    JoinRoomPayload, LeftRoomPayload,
    MessagePayload,
    RotatedSimulationPayload,
    RotateSimulationPayload,
    SendMessagePayload
} from '../types/sockets';


export default class SocketHandler {
    io: Server;

    constructor(app) {
        this.io = socketIO(app);
        this.io.sockets.on('connect', this.onSocketConnection.bind(this));
    }

    onSocketConnection(socket: Socket) {
        new SocketConnection(socket, this.io);
    }
}

class SocketConnection {
    socket: Socket;
    io: Server;
    user: string;
    room: string;

    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this.setListeners();
    }

    on(type: SocketIMessage, listener: (...args: any[]) => void) {
        this.socket.on(type, listener.bind(this));
    }

    emit(type: SocketOMessage, payload: any) {
        if (this.room) {
            this.io.to(this.room).emit(type, payload);
        } else {
            console.log('no room to emit!', this.user);
        }
    }

    setListeners() {
        this.on(SocketIMessage.JOIN_ROOM, this.onJoinRoom);
        this.on(SocketIMessage.LEAVE_ROOM, this.onLeaveRoom);
        this.on(SocketIMessage.ROTATE_SIMULATION, this.onRotateSimulation);
        this.on(SocketIMessage.SEND_MESSAGE, this.onSendMessage);
    }

    onLeaveRoom() {
        console.log(SocketIMessage.LEAVE_ROOM, this.user, this.room);
        this.emit(SocketOMessage.LEFT_ROOM, <LeftRoomPayload>{
            user: this.user
        });
        this.socket.leave(this.room);
        this.room = null;
    }

    onJoinRoom(payload: JoinRoomPayload) {
        console.log(SocketIMessage.JOIN_ROOM, this.user, this.room, payload);
        this.room = payload.room;
        this.user = payload.user;
        this.socket.join(this.room);
        this.emit(SocketOMessage.JOINED_ROOM, <JoinedRoomPayload>payload);
    }

    onRotateSimulation(payload: RotateSimulationPayload) {
        console.log(SocketIMessage.ROTATE_SIMULATION, this.user, this.room, payload);
        this.emit(SocketOMessage.ROTATED_SIMULATION, <RotatedSimulationPayload>{
            x: payload.x,
            y: payload.y
        });
    }

    onSendMessage(payload: SendMessagePayload) {
        console.log(SocketIMessage.SEND_MESSAGE, this.user, this.room, payload);
        this.emit(SocketOMessage.MESSAGE, <MessagePayload>{
            author: this.user,
            content: payload.content,
            type: payload.type
        });
    }
}
