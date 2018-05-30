import {createActionCreator} from "@state/constants/generic";
import {
    JoinedRoomPayload,
    MessagePayload,
    LeftRoomPayload,
    SendMessagePayload,
    JoinRoomPayload
} from "@request/types/sockets";

export const
    SEND_MESSAGE = createActionCreator<SendMessagePayload>('SEND_MESSAGE'),
    MESSAGE = createActionCreator<MessagePayload>('MESSAGE'),
    JOIN_ROOM = createActionCreator<JoinRoomPayload>('JOIN_ROOM'),
    JOINED_ROOM = createActionCreator<JoinedRoomPayload>('JOINED_ROOM'),
    LEAVE_ROOM = createActionCreator('LEAVE_ROOM'),
    LEFT_ROOM = createActionCreator<LeftRoomPayload>('LEFT_ROOM');
