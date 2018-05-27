import THREE from './three';
import './requestAnimationFrame.polyfill.js';

export interface RotatorPayload {
    x: number;
    y: number;
}

const rotationSmoothingRatio = 0.95;

let rotationX = 0,
    rotationY = 0,
    smoothedRotationX = 0,
    smoothedRotationY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    rotationListener: ((p: RotatorPayload) => void) | null = null;

const rotateByAxis = (object, axis1, radians1, axis2, radians2) => {
    const rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis(axis1.normalize(), radians1);

    if (axis2) {
        const rotationMatrix2 = new THREE.Matrix4();
        rotationMatrix2.makeRotationAxis(axis2.normalize(), radians2);

        rotationMatrix.multiply(rotationMatrix2);
    }

    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
};


export const attachRotator = (element) => {
        let
            mouseX = 0,
            mouseXOnMouseDown = 0,
            mouseY = 0,
            mouseYOnMouseDown = 0;

        const onDocumentMouseDown = (event) => {
                event.preventDefault();

                element.addEventListener("mousemove", onDocumentMouseMove, false);
                element.addEventListener("mouseup", onDocumentMouseUp, false);
                element.addEventListener("mouseout", onDocumentMouseOut, false);

                mouseXOnMouseDown = event.clientX - windowHalfX;
                mouseYOnMouseDown = event.clientY - windowHalfY;
            },

            onDocumentMouseMove = (event) => {
                mouseX = event.clientX - windowHalfX;
                // rotationX += (mouseX - mouseXOnMouseDown) * 0.00025;

                mouseY = event.clientY - windowHalfY;
                // rotationY += (mouseY - mouseYOnMouseDown) * 0.00025;

                // rotationListener && rotationListener({x: rotationX, y: rotationY});
                const
                    nextX = rotationX + (mouseX - mouseXOnMouseDown) * 0.00025,
                    nextY = rotationY + (mouseY - mouseYOnMouseDown) * 0.00025;

                if (rotationListener) {
                    // Flux way
                    rotationListener({x: nextX, y: nextY});
                } else {
                    // Classic way
                    rotationX = nextX;
                    rotationY = nextY;
                }
            },

            onDocumentMouseUp = () => {
                element.removeEventListener("mousemove", onDocumentMouseMove, false);
                element.removeEventListener("mouseup", onDocumentMouseUp, false);
                element.removeEventListener("mouseout", onDocumentMouseOut, false);
            },

            onDocumentMouseOut = () => {
                element.removeEventListener("mousemove", onDocumentMouseMove, false);
                element.removeEventListener("mouseup", onDocumentMouseUp, false);
                element.removeEventListener("mouseout", onDocumentMouseOut, false);
            };

        element.addEventListener("mousedown", onDocumentMouseDown, false);
    },

    setRotation = ({x, y}: RotatorPayload) => {
        rotationX = x;
        rotationY = y;
    },

    setRotationListener = (callback: ((p: RotatorPayload) => void) | null) => {
        rotationListener = callback;
    },

    onWindowResize = () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    },

    applyRotationToObject = (object) => {
        smoothedRotationX = smoothedRotationX * rotationSmoothingRatio + rotationX * (1 - rotationSmoothingRatio);
        smoothedRotationY = smoothedRotationY * rotationSmoothingRatio + rotationY * (1 - rotationSmoothingRatio);
        rotateByAxis(object, new THREE.Vector3(1, 1, 0), smoothedRotationX, new THREE.Vector3(1, 0, 0), smoothedRotationY);
    };

(window as any).setRotation = setRotation;
