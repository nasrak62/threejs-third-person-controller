import { Collider, ColliderDesc, RigidBody } from "@dimforge/rapier3d";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export type TGetTextFunc = (
  text: string,
) => THREE.Mesh<
  TextGeometry,
  THREE.MeshPhongMaterial[],
  THREE.Object3DEventMap
>;

export type TCreateFloorResult = {
  mesh: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;
  shape: ColliderDesc | null;
  body: RigidBody | null;
  collider: Collider | null;
};

export type TCreateBlockResult = {
  mesh: THREE.Group<THREE.Object3DEventMap>;
  shape: ColliderDesc | null;
  body: RigidBody | null;
  collider: Collider | null;
};
