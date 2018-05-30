import {JoinRoomPayload, SendMessagePayload} from "@request/types/sockets";
import {EmitJoinRoom, EmitLeaveRoom, EmitMessage} from "@request/simulation";
import {JOIN_ROOM, LEAVE_ROOM, SEND_MESSAGE} from "@state/constants/room";

export const
    joinRoom = dispatch => (params: JoinRoomPayload) => {
        EmitJoinRoom(params);
        dispatch(JOIN_ROOM(params));
    },

    leaveRoom = dispatch => () => {
        EmitLeaveRoom();
        dispatch(LEAVE_ROOM());
    },

    sendMessage = dispatch => (params: SendMessagePayload) => {
        EmitMessage(params);
        dispatch(SEND_MESSAGE(params));
    };


