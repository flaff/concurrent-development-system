import {EmitChangeSimulation, EmitRotateSimulation} from "@request/simulation";
import {CHANGE_SIMULATION, ROTATE_SIMULATION} from "@state/constants/simulation";
import {RotateSimulationParams} from "@request/types/simulation";
import {ChangeSimulationPayload} from "@request/types/sockets";

export const
    rotateSimulation = dispatch => (params: RotateSimulationParams) => {
        EmitRotateSimulation(params);
        dispatch(ROTATE_SIMULATION(params));
    },

    changeSimulation = dispatch => (params: ChangeSimulationPayload) => {
        EmitChangeSimulation(params);
        dispatch(CHANGE_SIMULATION(params));
    };


