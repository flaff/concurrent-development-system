import {createActionCreator, createGenericRequestConsts} from "@state/constants/generic";
import {
    JoinedRoomPayload,
    MessagePayload,
    LeftRoomPayload,
    SendMessagePayload,
    JoinRoomPayload, ShowInfoMessagesChangePayload
} from "@request/types/sockets";
import {RestoreSessionResponse} from "@request/types";

export const
    SEND_MESSAGE = createActionCreator<SendMessagePayload>('SEND_MESSAGE'),
    RESTORE_SESSION = createGenericRequestConsts<RestoreSessionResponse>('RESTORE_SESSION'),
    MESSAGE = createActionCreator<MessagePayload>('MESSAGE'),
    JOIN_ROOM = createActionCreator<JoinRoomPayload>('JOIN_ROOM'),
    JOINED_ROOM = createActionCreator<JoinedRoomPayload>('JOINED_ROOM'),
    LEAVE_ROOM = createActionCreator('LEAVE_ROOM'),
    SHOW_INFO_MESSAGES_CHANGE = createActionCreator<ShowInfoMessagesChangePayload>('SHOW_INFO_MESSAGES_CHANGE'),
    LEFT_ROOM = createActionCreator<LeftRoomPayload>('LEFT_ROOM');
