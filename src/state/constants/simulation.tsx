import {createActionCreator} from "@state/constants/generic";
import {RotateSimulationParams} from "@request/types/simulation";

export const
    ROTATE_SIMULATION = createActionCreator<RotateSimulationParams>('ROTATE_SIMULATION'),
    ROTATED_SIMULATION = createActionCreator<RotateSimulationParams>('ROTATED_SIMULATION');
