import * as THREE from "three";

const BASE_DISTANCE = 10;
export const ABSOLUTE_FORWARD_VECTOR = new THREE.Vector3(0, 0, -1);
export const ABSOLUTE_RIGHT_VECTOR = new THREE.Vector3(1, 0, 0);
const CAMERA_HEIGHT_OFFSET = 5;
const LOOK_AT_MIN = -15;
const LOOK_AT_MAX = 60;
export const CAMERA_INITAL_VALUES = {
  angle: Math.PI * 0.25,
  length: BASE_DISTANCE,
};

export const getAngleFromAbsoluteForward = (vector: THREE.Vector3) => {
  return vector.angleTo(ABSOLUTE_FORWARD_VECTOR);
};

export const calculateCameraNewPosition = (
  angle: number,
  playerPosition: THREE.Vector3,
) => {
  const radius = CAMERA_INITAL_VALUES.length;

  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = playerPosition.y + CAMERA_HEIGHT_OFFSET;
  const newPosition = new THREE.Vector3(
    x + playerPosition.x,
    y,
    z + playerPosition.z,
  );

  return newPosition;
};

export const getLookAtPosition = (
  playerDirection: THREE.Vector3,
  playerPosition: THREE.Vector3,
  oldYPosition: number,
  offset: number,
) => {
  const forwardOffset = playerDirection.multiplyScalar(BASE_DISTANCE);

  const lookAtPosition = playerPosition.add(forwardOffset);

  lookAtPosition.y = Math.min(
    Math.max(oldYPosition - offset, LOOK_AT_MIN),
    LOOK_AT_MAX,
  );

  return lookAtPosition;
};
