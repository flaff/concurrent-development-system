import socket from "@request/socket";
import {ROTATE_SIMULATION, ROTATED_SIMULATION} from "@state/constants/simulation";
import {RotateSimulationParams} from "@request/types/simulation";

let onRotatedListener: ((p: RotateSimulationParams) => void) | null = null;
socket.on(ROTATED_SIMULATION.type, (p: RotateSimulationParams) => onRotatedListener && onRotatedListener(p));

export const
    EmitRotateSimulation = (payload: RotateSimulationParams) => socket.emit(ROTATE_SIMULATION.type, payload),
    OnRotatedSimulation = (listener: ((p: RotateSimulationParams) => void)) => onRotatedListener = listener;
