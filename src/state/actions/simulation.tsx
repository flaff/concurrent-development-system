import {EmitRotateSimulation} from "@request/simulation";
import {ROTATE_SIMULATION} from "@state/constants/simulation";
import {RotateSimulationParams} from "@request/types/simulation";

export const
    rotateSimulation = dispatch => (params: RotateSimulationParams) => {
        EmitRotateSimulation(params);
        dispatch(ROTATE_SIMULATION(params));
    };

