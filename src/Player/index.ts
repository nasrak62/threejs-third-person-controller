import * as THREE from "three";
import Game from "../Game";
import { createPlayer } from "../World/utils";
import { CENTER_POINT_VECTOR } from "./utils";

export default class Player {
  game: Game;
  model: THREE.Group<THREE.Object3DEventMap>;

  constructor() {
    this.game = new Game();

    this.model = createPlayer();

    this.game.scene.add(this.model);
  }

  getBackDirection() {
    const direction = this.model.getWorldDirection(new THREE.Vector3());

    return direction.normalize();
  }

  getFrontDirection() {
    let direction = this.getBackDirection();
    direction = direction.negate().normalize();

    return direction;
  }

  getDistanceFromCenter() {
    return this.model.position.distanceTo(CENTER_POINT_VECTOR);
  }
}
