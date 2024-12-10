import * as THREE from "three";

export const rotateVector = (vector: THREE.Vector3, angle: number) => {
  const y = 0;
  const x = vector.x * Math.cos(angle) - vector.z * Math.sin(angle);
  const z = vector.x * Math.sin(angle) + vector.z * Math.cos(angle);

  return new THREE.Vector3(x, y, z);
};
