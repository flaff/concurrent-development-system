import {RoomState} from "@state/types/room";
import {IAction} from "@state/constants/generic";
import {GET_ALL_MESSAGES, LEAVE_ROOM, SHOW_INFO_MESSAGES_CHANGE} from "@state/constants/room";
import {JOIN_ROOM, JOINED_ROOM, MESSAGE} from "@state/constants/room";
import {MessagePayload, JoinedRoomPayload, LeftRoomPayload, JoinRoomPayload} from "@request/types/sockets";
import {GetAllMessagesResponse} from "@request/types";

const
    defaultState: RoomState = {
        name: '',
        messages: [],
        id: '',
        showInfoMessages: true
    },

    leaveRoomReducer = (state: RoomState) => ({
        ...state,
        id: '',
        name: '',
        messages: []
    }),

    joinRoomReducer = (state: RoomState, action: IAction<JoinedRoomPayload>) => ({
        ...state,
        name: (action.payload as JoinedRoomPayload).user
    }),

    messageReducer = (state: RoomState, action: IAction<MessagePayload>) => ({
        ...state,
        messages: [
            ...state.messages,
            action.payload as MessagePayload
        ]
    }),

    getAllMessagesSuccessReducer = (state: RoomState, action: IAction<GetAllMessagesResponse>) => ({
        ...state,
        messages: action.payload.Messages,
        name: action.payload.Name,
        id: action.payload._id
    }),

    showInfoMessagesChangeReducer = (state: RoomState, action: ReturnType<typeof SHOW_INFO_MESSAGES_CHANGE>): RoomState => ({
        ...state,
        showInfoMessages: action.payload.show
    });

export default function roomReducer(state: RoomState, action: IAction<any>) {
    switch (action.type) {
        case SHOW_INFO_MESSAGES_CHANGE.type:
            return showInfoMessagesChangeReducer(state, action);

        case LEAVE_ROOM.type:
            return leaveRoomReducer(state);

        case JOIN_ROOM.type:
            return joinRoomReducer(state, action);

        case MESSAGE.type:
            return messageReducer(state, action);

        case GET_ALL_MESSAGES.SUCCESS.type:
            return getAllMessagesSuccessReducer(state, action);

        default:
            return state || defaultState;
    }
}
