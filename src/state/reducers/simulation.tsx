import {SimulationState} from "@state/types/simulation";
import {CHANGED_AUTOPLAY_SIMULATION, CHANGED_SIMULATION, ROTATED_SIMULATION} from "@state/constants/simulation";
import {LEAVE_ROOM, RESTORE_SESSION} from "@state/constants/room";
import {RoomState} from "@state/types/room";
import {IAction} from "@state/constants/generic";
import {RestoreSessionResponse} from "@request/types";

const
    defaultSimulationState: SimulationState = {
        rotateX: 0,
        rotateY: 0,
        url: '',
        name: '',
        autoPlay: false
    },

    restoreSessionSuccessReducer = (state: SimulationState, action: ReturnType<typeof RESTORE_SESSION.SUCCESS>): SimulationState => ({
        ...state,
        rotateX: action.payload.State && action.payload.State.x || state.rotateX,
        rotateY: action.payload.State && action.payload.State.y || state.rotateY,
        name: action.payload.State && action.payload.State.fileUrl || state.name,
        url: action.payload.State && action.payload.State.fileUrl && `http://localhost:3001/api/simulation/${action.payload.State.fileUrl}` || state.url,
        autoPlay: action.payload.State && action.payload.State.autoPlay !== undefined ? action.payload.State.autoPlay : state.autoPlay
    }),

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
    }),

    leaveRoomReducer = (state: SimulationState, action: ReturnType<typeof LEAVE_ROOM>) => ({
        ...defaultSimulationState
    });

export default function simulationReducer(state: SimulationState, action: any) {
    switch (action.type) {
        case RESTORE_SESSION.SUCCESS.type:
            return restoreSessionSuccessReducer(state, action);

        case LEAVE_ROOM.type:
            return leaveRoomReducer(state, action);

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
