import { Collider, ColliderDesc, RigidBody } from "@dimforge/rapier3d";
import { TBaseModalType, TRenderedObjectArgs } from "./types";

export default class RenderedObject<T extends TBaseModalType> {
  mesh: TBaseModalType;
  body: RigidBody | null;
  collider: Collider | null;
  shape: ColliderDesc | null;

  constructor({
    mesh,
    body = null,
    collider = null,
    shape = null,
  }: TRenderedObjectArgs<T>) {
    this.mesh = mesh;
    this.body = body;
    this.collider = collider;
    this.shape = shape;
  }

  animate() {
    if (!this.body) {
      return;
    }

    this.mesh.position.copy(this.body.translation());
    this.mesh.quaternion.copy(this.body.rotation());
  }
}
