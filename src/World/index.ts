import * as THREE from "three";
import Game from "../Game";
import {
  createCube,
  createFloor,
  createFront,
  createLine,
  createText,
} from "./utils";
import PlayerCamera from "../PlayerCamera";
import Player from "../Player";
import PlayerController from "../PlayerController";

export default class World {
  game: Game;
  playerCamera: PlayerCamera;
  line: THREE.Line<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.LineBasicMaterial,
    THREE.Object3DEventMap
  >;
  player: Player;
  floor: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;
  enemie: THREE.Group<THREE.Object3DEventMap>;
  lookAtObject: THREE.Group<THREE.Object3DEventMap>;
  front: THREE.Group<THREE.Object3DEventMap>;
  playerController: PlayerController;

  constructor() {
    this.game = new Game();
    this.player = new Player();

    console.log(this.game);

    const light = new THREE.AmbientLight(0x404040, 1.0); // soft white light
    this.game.scene.add(light);
    this.playerCamera = new PlayerCamera();
    this.playerController = new PlayerController();

    this.line = createLine();
    this.game.scene.add(this.line);

    this.floor = createFloor();

    this.game.scene.add(this.floor);

    this.enemie = createCube(this.getTextFunction(), "enemie", 0x0000ff);

    this.game.scene.add(this.enemie);

    this.front = createFront(this.getTextFunction(), "front", 0xff00ff);

    this.game.scene.add(this.front);

    this.lookAtObject = createCube(this.getTextFunction(), "look at", 0xaa4ac3);

    this.game.scene.add(this.lookAtObject);
  }

  getTextFunction() {
    return createText(this.game.font);
  }

  animate() {
    const points = this.line.geometry.attributes.position.array;
    const direction = this.player.getFrontDirection();

    points[3] = direction.x;
    points[4] = direction.y;
    points[5] = direction.z;

    this.line.geometry.attributes.position.needsUpdate = true;

    if (this.playerCamera.lookAt) {
      this.lookAtObject.position.copy(this.playerCamera.lookAt);
    }
    this.playerCamera.animate();
    this.playerController.animate();
  }
}
