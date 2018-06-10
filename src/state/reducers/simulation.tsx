import {SimulationState} from "@state/types/simulation";
import {CHANGED_AUTOPLAY_SIMULATION, CHANGED_SIMULATION, ROTATED_SIMULATION} from "@state/constants/simulation";

const
    defaultSimulationState: SimulationState = {
        rotateX: 0,
        rotateY: 0,
        url: '',
        name: '',
        autoPlay: false
    },

    rotatedSimulationReducer = (state: SimulationState, action: ReturnType<typeof ROTATED_SIMULATION>): SimulationState => ({
        ...state,
        rotateX: action.payload.x,
        rotateY: action.payload.y
    }),

    changedSimulationReducer = (state: SimulationState, action: ReturnType<typeof CHANGED_SIMULATION>): SimulationState => ({
        ...state,
        name: action.payload.name,
        url: action.payload.url
    }),

    changedAutoplaySimulationReducer = (state: SimulationState, action: ReturnType<typeof CHANGED_AUTOPLAY_SIMULATION>): SimulationState => ({
        ...state,
        autoPlay: action.payload.autoPlay
    });

export default function simulationReducer(state: SimulationState, action: any) {
    switch (action.type) {
        case CHANGED_AUTOPLAY_SIMULATION.type:
            return changedAutoplaySimulationReducer(state, action);

        case CHANGED_SIMULATION.type:
            return changedSimulationReducer(state, action);

        case ROTATED_SIMULATION.type:
            return rotatedSimulationReducer(state, action);

        default:
            return state || defaultSimulationState;
    }
}
