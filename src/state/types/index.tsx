import {UserState} from "@state/types/user";
import {SimulationState} from "@state/types/simulation";

export interface StoreState {
    user: UserState;
    simulation: SimulationState;
    routing: any;
}
