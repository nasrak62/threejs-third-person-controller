import { Rotation, Vector } from "@dimforge/rapier3d";
import * as THREE from "three";

export const getVectorString = (
  currentVector?: THREE.Vector3 | null | THREE.Euler | Vector,
) => {
  if (!currentVector) {
    return "";
  }

  const vectorString = `(${currentVector.x}, ${currentVector.y}, ${currentVector.z})`;

  return vectorString;
};

export const getQuaternionString = (
  currentQuaternion?: THREE.Quaternion | null | Rotation,
) => {
  if (!currentQuaternion) {
    return "";
  }

  const vectorString = `(${currentQuaternion.x}, ${currentQuaternion.y}, ${currentQuaternion.z}, ${currentQuaternion.w})`;

  return vectorString;
};
