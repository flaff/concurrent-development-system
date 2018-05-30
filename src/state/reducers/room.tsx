import {RoomState} from "@state/types/room";
import {IAction} from "@state/constants/generic";
import {} from "@state/constants/room";
import {JOIN_ROOM, JOINED_ROOM, MESSAGE} from "@state/constants/room";
import {MessagePayload, JoinedRoomPayload, LeftRoomPayload, JoinRoomPayload} from "@request/types/sockets";

const
    defaultState: RoomState = {
        name: '',
        messages: []
    };

export default function roomReducer(state: RoomState, action: IAction<any>) {
    switch (action.type) {
        case JOIN_ROOM.type:
            return {
                ...state,
                name: (action.payload as JoinedRoomPayload).user
            };

        case MESSAGE.type:
            return {
                ...state,
                messages: [
                    ...state.messages,
                    action.payload as MessagePayload
                ]
            };

        default:
            return state || defaultState;
    }
}
