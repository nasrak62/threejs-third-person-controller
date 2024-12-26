import * as THREE from "three";
import { Collider, ColliderDesc, RigidBody } from "@dimforge/rapier3d";

export type TBaseModalType = THREE.Mesh | THREE.Group;

export type TRenderedObjectArgs<T extends TBaseModalType> = {
  mesh: T;
  shape?: ColliderDesc | null;
  body?: RigidBody | null;
  collider?: Collider | null;
};
