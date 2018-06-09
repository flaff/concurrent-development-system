import {JoinRoomPayload, SendMessagePayload} from "@request/types/sockets";
import {EmitJoinRoom, EmitLeaveRoom, EmitMessage} from "@request/simulation";
import {GET_ALL_MESSAGES, JOIN_ROOM, LEAVE_ROOM, SEND_MESSAGE} from "@state/constants/room";
import {GetAllMessagesPayload} from "@request/types";
import {RequestAllMessages} from "@request/session";

export const
    joinRoom = dispatch => (params: JoinRoomPayload) => {
        EmitJoinRoom(params);
        dispatch(JOIN_ROOM(params));
    },

    leaveRoom = dispatch => (params: any) => {
        EmitLeaveRoom(params);
        dispatch(LEAVE_ROOM(params));
    },

    sendMessage = dispatch => (params: SendMessagePayload) => {
        EmitMessage(params);
        dispatch(SEND_MESSAGE(params));
    },

    getAllMessages = dispatch => (params: GetAllMessagesPayload) => {
        dispatch(GET_ALL_MESSAGES.START());
        RequestAllMessages(params)
            .then((request) => dispatch(GET_ALL_MESSAGES.SUCCESS(request.data)))
            .catch((error) => dispatch(GET_ALL_MESSAGES.ERROR(error)))
    };


