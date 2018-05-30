import {UserState} from "@state/types/user";
import {SimulationState} from "@state/types/simulation";
import {RoomState} from "@state/types/room";

export interface StoreState {
    user: UserState;
    simulation: SimulationState;
    room: RoomState;
    routing: any;
}
