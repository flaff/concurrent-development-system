import {SimulationState} from "@state/types/simulation";
import {IAction} from "@state/constants/generic";
import {RotateSimulationParams} from "@request/types/simulation";
import {ROTATE_SIMULATION, ROTATED_SIMULATION} from "@state/constants/simulation";

const
    defaultSimulationState: SimulationState = {
        rotateX: 0,
        rotateY: 0
    };

export default function simulationReducer(state: SimulationState, action: IAction<RotateSimulationParams>) {
    switch (action.type) {
        case ROTATED_SIMULATION.type:
            return {
                ...state,
                rotateX: action.payload.x,
                rotateY: action.payload.y
            };

        default:
            return state || defaultSimulationState;
    }
}
