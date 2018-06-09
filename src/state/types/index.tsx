import {UserState} from "@state/types/user";
import {SimulationState} from "@state/types/simulation";
import {RoomState} from "@state/types/room";
import {SessionsState} from "@state/types/sessions";

export interface StoreState {
    user: UserState;
    simulation: SimulationState;
    room: RoomState;
    sessions: SessionsState;
    routing: any;
}
