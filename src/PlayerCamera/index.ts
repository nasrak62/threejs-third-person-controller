import * as THREE from "three";
import Game from "../Game";
import {
  ABSOLUTE_RIGHT_VECTOR,
  calculateCameraNewPosition,
  CAMERA_INITAL_VALUES,
  getAngleFromAbsoluteForward,
  getLookAtPosition,
} from "./utils";
import Player from "../Player";

export default class PlayerCamera {
  game: Game;
  movementFactorHorizontal: number;
  lookAt: THREE.Vector3 | null;

  constructor() {
    this.game = new Game();
    this.movementFactorHorizontal = 0.1;
    this.lookAt = null;

    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  handleMouseMove(event: MouseEvent) {
    const player = this.game.getPlayer();

    const movementX = event.movementX;
    const movementY = event.movementY;
    const yValue =
      movementX * this.game.deltaTime * this.movementFactorHorizontal;
    const xValue = movementY * this.game.deltaTime * 1;

    player.model.rotation.y -= yValue;

    this.initLookAt({ player, offset: xValue });
  }

  initLookAt({ player, offset = 0 }: { offset?: number; player: Player }) {
    const lookAt = getLookAtPosition(
      player.getFrontDirection(),
      player.model.position.clone(),
      this.lookAt?.y || 0,
      offset,
    );

    this.lookAt = lookAt;
  }

  animate() {
    const player = this.game.getPlayer();

    if (player && !this.lookAt) {
      this.initLookAt({ player });
    }

    const camera = this.game.getCamera();

    let alpha = getAngleFromAbsoluteForward(player.getFrontDirection());
    const isLeft = player.getFrontDirection().dot(ABSOLUTE_RIGHT_VECTOR) < 0;

    alpha = isLeft ? Math.PI * 2 - alpha : alpha;

    let finalAngle = alpha + CAMERA_INITAL_VALUES.angle;

    const newPosition = calculateCameraNewPosition(
      finalAngle,
      player.model.position,
    );

    camera.position.lerp(newPosition, 0.7);

    if (this.lookAt) {
      camera.lookAt(this.lookAt);
    }
  }
}
