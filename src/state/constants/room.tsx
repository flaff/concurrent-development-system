import {createActionCreator, createGenericRequestConsts} from "@state/constants/generic";
import {
    JoinedRoomPayload,
    MessagePayload,
    LeftRoomPayload,
    SendMessagePayload,
    JoinRoomPayload, ShowInfoMessagesChangePayload
} from "@request/types/sockets";
import {GetAllMessagesResponse} from "@request/types";

export const
    SEND_MESSAGE = createActionCreator<SendMessagePayload>('SEND_MESSAGE'),
    GET_ALL_MESSAGES = createGenericRequestConsts<GetAllMessagesResponse>('GET_ALL_MESSAGES'),
    MESSAGE = createActionCreator<MessagePayload>('MESSAGE'),
    JOIN_ROOM = createActionCreator<JoinRoomPayload>('JOIN_ROOM'),
    JOINED_ROOM = createActionCreator<JoinedRoomPayload>('JOINED_ROOM'),
    LEAVE_ROOM = createActionCreator('LEAVE_ROOM'),
    SHOW_INFO_MESSAGES_CHANGE = createActionCreator<ShowInfoMessagesChangePayload>('SHOW_INFO_MESSAGES_CHANGE'),
    LEFT_ROOM = createActionCreator<LeftRoomPayload>('LEFT_ROOM');
