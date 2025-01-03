import * as THREE from "three";
import Game from "../Game";
import {
  ABSOLUTE_RIGHT_VECTOR,
  ABSOLUTE_UP_VECTOR,
  calculateCameraNewPosition,
  CAMERA_INITAL_VALUES,
  getAngleFromAbsoluteForward,
  getLookAtPosition,
  getPlayerPhysicsQuaternion,
} from "./utils";
import Player from "../Player";
import { rapierToThreeVector } from "../utils/vector";

export default class PlayerCamera {
  game: Game;
  movementFactorHorizontal: number;
  lookAt: THREE.Vector3 | null;
  heightDiff: number;

  constructor() {
    this.game = new Game();
    this.movementFactorHorizontal = 0.1 * 0.7;
    this.lookAt = null;
    this.heightDiff = 0;

    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  handleMouseMove(event: MouseEvent) {
    const player = this.game.getPlayer();

    const movementX = event.movementX;
    const movementY = event.movementY;

    const yValue =
      movementX * this.game.deltaTime * this.movementFactorHorizontal;

    const xValue = movementY * this.game.deltaTime * 1;

    const yQuaternion = new THREE.Quaternion().setFromAxisAngle(
      ABSOLUTE_UP_VECTOR.clone(),
      -yValue,
    );

    const updatedQuaternion =
      getPlayerPhysicsQuaternion(player).multiply(yQuaternion);

    updatedQuaternion.normalize();

    player.body.body?.setRotation(updatedQuaternion, true);

    this.initLookAtYPosition({ player, offset: xValue });
  }

  initLookAtYPosition({
    player,
    offset = 0,
  }: {
    offset?: number;
    player: Player;
  }) {
    const oldYPosition = this.lookAt?.y || 0;
    const currentPosition = rapierToThreeVector(
      player.body.body?.translation(),
    );

    const lookAt = getLookAtPosition(
      player.getFrontDirection(),
      currentPosition,
      offset,
      oldYPosition,
    );

    this.lookAt = lookAt;
  }

  animate() {
    const player = this.game.getPlayer();
    const camera = this.game.getCamera();

    let alpha = getAngleFromAbsoluteForward(player.getFrontDirection());

    const isLeft =
      player.getFrontDirection().dot(ABSOLUTE_RIGHT_VECTOR.clone()) < 0;

    alpha = isLeft ? Math.PI * 2 - alpha : alpha;

    let finalAngle = alpha + CAMERA_INITAL_VALUES.angle;

    const newPosition = calculateCameraNewPosition(
      finalAngle,
      player.body.body?.translation(),
    );

    camera.position.lerp(newPosition, 0.7);

    if (this.lookAt) {
      camera.lookAt(this.lookAt);
    }
  }
}
