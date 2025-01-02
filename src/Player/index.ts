import * as THREE from "three";
import Game from "../Game";
import { createPlayer } from "../World/utils";
import { CENTER_POINT_VECTOR } from "./utils";
import RenderedObject from "../RenderedObject";
import PlayerCamera from "../PlayerCamera";
import PlayerController from "../PlayerController";

export default class Player {
  game: Game;
  body: RenderedObject<THREE.Group<THREE.Object3DEventMap>>;
  playerCamera: PlayerCamera;
  playerController: PlayerController;

  constructor() {
    this.game = new Game();
    const scene = this.game.scene;
    const world = this.game.physicsWorld;
    const RAPIER = this.game.RAPIER;
    this.playerCamera = new PlayerCamera();
    this.playerController = new PlayerController();

    this.body = createPlayer(RAPIER, world, scene);
  }

  getBackDirection() {
    const direction = this.body.mesh.getWorldDirection(new THREE.Vector3());

    return direction.normalize();
  }

  getFrontDirection() {
    let direction = this.getBackDirection();
    direction = direction.negate().normalize();

    return direction;
  }

  getDistanceFromCenter() {
    return this.body.mesh.position.distanceTo(CENTER_POINT_VECTOR);
  }

  animate() {
    this.body.animate();
    this.playerCamera.animate();
    this.playerController.animate();

    const translation = this.body.body?.translation();

    if (translation && translation.y < -1) {
      this.body.body?.setTranslation(new THREE.Vector3(1, 1, 1), false);
    }
  }
}
