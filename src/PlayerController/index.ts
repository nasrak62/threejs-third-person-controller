import Game from "../Game";
import { rotateVector } from "./utils";
import Player from "../Player";
import { ABSOLUTE_UP_VECTOR } from "../PlayerCamera/utils";
import { rapierToThreeVector } from "../utils/vector";

export default class PlayerController {
  game: Game;
  keyW: boolean;
  keyS: boolean;
  keyD: boolean;
  keyA: boolean;
  shift: boolean;
  space: boolean;
  baseSpeed: number;
  baseJumpSpeed: number;

  constructor() {
    this.game = new Game();
    this.keyW = false;
    this.keyS = false;
    this.keyD = false;
    this.keyA = false;
    this.shift = false;
    this.space = false;
    this.baseSpeed = 20;
    this.baseJumpSpeed = 10;

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.code === "KeyD") {
      this.keyD = true;
    }

    if (event.code === "KeyA") {
      this.keyA = true;
    }

    if (event.code === "KeyW") {
      this.keyW = true;
    }

    if (event.code === "KeyS") {
      this.keyS = true;
    }

    if (event.code === "Space") {
      this.space = true;
    }

    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      this.shift = true;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.code === "KeyD") {
      this.keyD = false;
    }

    if (event.code === "KeyA") {
      this.keyA = false;
    }

    if (event.code === "KeyW") {
      this.keyW = false;
    }

    if (event.code === "KeyS") {
      this.keyS = false;
    }

    if (event.code === "Space") {
      this.space = false;
    }

    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      this.shift = false;
    }
  }

  calculateSpeed(player: Player) {
    const mass = player.body.body?.mass() || 1;
    const gameCoefficient = this.game.deltaTime * mass;
    let speed = gameCoefficient * this.baseSpeed;
    let jumpSpeed = gameCoefficient * this.baseJumpSpeed;

    if (this.shift) {
      speed *= 3;
      jumpSpeed *= 3;
    }

    return [speed, jumpSpeed];
  }

  getMovementVectors(player: Player) {
    const [speed, jumpSpeed] = this.calculateSpeed(player);
    const forwardDirection = player.getFrontDirection();
    const backwardDirection = player.getBackDirection();
    const rightDirection = rotateVector(forwardDirection, Math.PI / 2);
    const leftDirection = rotateVector(forwardDirection, (3 * Math.PI) / 2);
    const keyS = backwardDirection.multiplyScalar(speed);
    const keyW = forwardDirection.multiplyScalar(speed);
    const space = ABSOLUTE_UP_VECTOR.clone().multiplyScalar(jumpSpeed);
    const keyA = leftDirection.multiplyScalar(speed);
    const keyD = rightDirection.multiplyScalar(speed);

    return {
      keyS,
      keyW,
      space,
      keyA,
      keyD,
    };
  }

  animate() {
    const player = this.game.getPlayer();

    const movementValues = this.getMovementVectors(player);
    const originalVelocity = player.body.body?.linvel();
    let movementValue = rapierToThreeVector(originalVelocity);

    if (this.space) {
      movementValue = movementValue.add(movementValues.space);
    }

    if (this.keyS) {
      movementValue = movementValue.add(movementValues.keyS);
    }

    if (this.keyW) {
      movementValue = movementValue.add(movementValues.keyW);
    }

    if (this.keyA) {
      movementValue = movementValue.add(movementValues.keyA);
    }

    if (this.keyD) {
      movementValue = movementValue.add(movementValues.keyD);
    }

    player.body.body?.setLinvel(movementValue, true);

    this.game.world.player.playerCamera.initLookAtYPosition({ player });
  }
}
