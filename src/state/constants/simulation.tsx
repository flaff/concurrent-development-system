import {createActionCreator} from "@state/constants/generic";
import {RotateSimulationParams} from "@request/types/simulation";
import {
    ChangedAutoplaySimulationPayload,
    ChangeAutoplaySimulationPayload,
    ChangedSimulationPayload,
    ChangeSimulationPayload
} from "@request/types/sockets";

export const
    ROTATE_SIMULATION = createActionCreator<RotateSimulationParams>('ROTATE_SIMULATION'),
    ROTATED_SIMULATION = createActionCreator<RotateSimulationParams>('ROTATED_SIMULATION'),

    CHANGE_SIMULATION = createActionCreator<ChangeSimulationPayload>('CHANGE_SIMULATION'),
    CHANGED_SIMULATION = createActionCreator<ChangedSimulationPayload>('CHANGED_SIMULATION'),

    CHANGE_AUTOPLAY_SIMULATION = createActionCreator<ChangeAutoplaySimulationPayload>('CHANGE_AUTOPLAY_SIMULATION'),
    CHANGED_AUTOPLAY_SIMULATION = createActionCreator<ChangedAutoplaySimulationPayload>('CHANGED_AUTOPLAY_SIMULATION');
