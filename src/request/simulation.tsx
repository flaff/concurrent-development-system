import socket from "@request/socket";
import {ROTATE_SIMULATION} from "@state/constants/simulation";
import {RotateSimulationParams} from "@request/types/simulation";

export const
    EmitRotateSimulation = (payload: RotateSimulationParams) => socket.emit(ROTATE_SIMULATION.type, payload);
