import * as THREE from "three";

export const getVectorString = (currentVector?: THREE.Vector3 | null) => {
  if (!currentVector) {
    return "";
  }

  const vectorString = `(${currentVector.x}, ${currentVector.y}, ${currentVector.z})`;

  return vectorString;
};
