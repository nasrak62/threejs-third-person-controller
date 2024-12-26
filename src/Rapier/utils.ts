import { TRapier } from "./types";

export const GRAVITY = {
  x: 0.0,
  y: -9.81,
  z: 0.0,
};

export const getPhysicsWorld = (RAPIER: TRapier | null) => {
  let physicsWorld = null;

  if (RAPIER) {
    physicsWorld = new RAPIER.World(GRAVITY);
  }

  return physicsWorld;
};
