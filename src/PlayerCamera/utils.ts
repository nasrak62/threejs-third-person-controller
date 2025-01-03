import { Vector } from "@dimforge/rapier3d";
import * as THREE from "three";
import Player from "../Player";

const BASE_DISTANCE = 10;
export const ABSOLUTE_FORWARD_VECTOR = new THREE.Vector3(0, 0, -1);
export const ABSOLUTE_RIGHT_VECTOR = new THREE.Vector3(1, 0, 0);
export const ABSOLUTE_UP_VECTOR = new THREE.Vector3(0, 1, 0);
const CAMERA_HEIGHT_OFFSET = 5;
const LOOK_AT_MIN = -15;
const LOOK_AT_MAX_LAND = 60;
const LOOK_AT_MAX_JUMP = 15;
export const CAMERA_INITAL_VALUES = {
  angle: Math.PI * 0.25,
  length: BASE_DISTANCE,
};

export const getAngleFromAbsoluteForward = (vector: THREE.Vector3) => {
  return vector.angleTo(ABSOLUTE_FORWARD_VECTOR.clone());
};

export const calculateCameraNewPosition = (
  angle: number,
  playerPosition?: THREE.Vector3 | Vector,
) => {
  if (!playerPosition) {
    return new THREE.Vector3();
  }

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

export const getHeightDiff = (firstHeight: number, secondHeight: number) => {
  const max = Math.max(firstHeight, secondHeight);
  const min = Math.min(firstHeight, secondHeight);

  return (max - min) * Math.sign(min);
};

export const getLookAtPosition = (
  playerDirection: THREE.Vector3,
  playerPosition: THREE.Vector3,
  offset: number,
  oldYPosition: number,
) => {
  const forwardOffset = playerDirection.multiplyScalar(BASE_DISTANCE);
  const lookAtPosition = playerPosition.add(forwardOffset);
  const maxValue =
    Math.round(playerPosition.y) !== 0 ? LOOK_AT_MAX_JUMP : LOOK_AT_MAX_LAND;

  lookAtPosition.y = Math.min(
    Math.max(oldYPosition - offset, playerPosition.y + LOOK_AT_MIN),
    maxValue + playerPosition.y,
  );

  return lookAtPosition;
};

export const getPlayerPhysicsQuaternion = (
  player: Player,
): THREE.Quaternion => {
  const physicsQuaternion = player.body.body?.rotation();

  const currentQuaternion = new THREE.Quaternion(
    physicsQuaternion?.x,
    physicsQuaternion?.y,
    physicsQuaternion?.z,
    physicsQuaternion?.w,
  );

  return currentQuaternion;
};

export const getPlayerMeshQuaternion = (player: Player): THREE.Quaternion => {
  const currentQuaternion = player.body.mesh?.quaternion;

  return currentQuaternion;
};
