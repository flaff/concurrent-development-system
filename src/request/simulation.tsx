import socket from '@request/socket';
import {ROTATE_SIMULATION, ROTATED_SIMULATION} from '@state/constants/simulation';
import {RotateSimulationParams} from '@request/types/simulation';
import axios from 'axios';

let onRotatedListener: ((p: RotateSimulationParams) => void) | null = null;
socket.on(ROTATED_SIMULATION.type, (p: RotateSimulationParams) => onRotatedListener && onRotatedListener(p));

export const
    EmitRotateSimulation = (payload: RotateSimulationParams) => socket.emit(ROTATE_SIMULATION.type, payload),
    OnRotatedSimulation = (listener: ((p: RotateSimulationParams) => void)) => onRotatedListener = listener,
    GetSimulationFileByName = (fileNumber: string) => {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem('token');
            if (token) {
                token = token.replace('"', '');
            } else {
                reject('Token not found');
            }
            axios.get(`http://${window.location.hostname}:3001/api/simulation/${fileNumber}`, {
                headers: {'Authorize': token}
            }).then((response) => {
                resolve(response.data.fileData);
            }).catch((err) => {
                reject(err);
            });
        });
    };