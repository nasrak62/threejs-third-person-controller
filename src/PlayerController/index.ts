import Game from "../Game";
import { rotateVector } from "./utils";

export default class PlayerController {
  game: Game;
  keyW: boolean;
  keyS: boolean;
  keyD: boolean;
  keyA: boolean;
  shift: boolean;
  space: boolean;

  constructor() {
    this.game = new Game();
    this.keyW = false;
    this.keyS = false;
    this.keyD = false;
    this.keyA = false;
    this.shift = false;
    this.space = false;

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

  animate() {
    const player = this.game.getPlayer();
    const forwardDirection = player.getFrontDirection();
    const backwardDirection = player.getBackDirection();
    const rightDirection = rotateVector(forwardDirection, Math.PI / 2);
    const leftDirection = rotateVector(forwardDirection, (3 * Math.PI) / 2);
    const speed = this.game.deltaTime * 20;

    if (this.keyS) {
      const value = backwardDirection.multiplyScalar(speed);

      player.model.position.add(value);
    }

    if (this.keyW) {
      const value = forwardDirection.multiplyScalar(speed);

      player.model.position.add(value);
    }

    if (this.keyA) {
      const value = leftDirection.multiplyScalar(speed);

      player.model.position.add(value);
    }

    if (this.keyD) {
      const value = rightDirection.multiplyScalar(speed);

      player.model.position.add(value);
    }

    this.game.world.playerCamera.initLookAt({ player });
  }
}
