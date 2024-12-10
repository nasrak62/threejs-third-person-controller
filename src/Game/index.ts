import * as THREE from "three";
import { Font, FontLoader } from "three/addons/loaders/FontLoader.js";
import { handlePointerLock, initRenderer, initSizes } from "./utils";
import { TSizes } from "./types";
import World from "../World";

let instance: Game | null = null;

export default class Game {
  scene!: THREE.Scene;
  sizes!: TSizes;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  world!: World;
  clock!: THREE.Clock;
  deltaTime!: number;
  elapsedTime!: number;
  hasLock!: boolean;
  fontLoader!: FontLoader;
  font!: Font;

  constructor() {
    if (instance) {
      return instance;
    }

    this.sizes = initSizes();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.ratio, 0.1, 1000);
    this.camera.position.z = 5;
    this.renderer = initRenderer(this.sizes);
    this.handleResize();
    this.clock = new THREE.Clock();
    this.hasLock = false;
    this.fontLoader = new FontLoader();

    this.addPointerLock();

    instance = this;
  }

  async loadFonts(): Promise<Font> {
    return new Promise((resolve) => {
      this.fontLoader.load(
        `${window.location.origin}/${window.location.pathname}/fonts/optimer_regular.typeface.json`,
        function (font) {
          resolve(font);
          // this.font = font
        },
      );
    });
  }

  handleLockRelese() {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
      this.hasLock = false;

      return;
    }

    if (document.pointerLockElement === canvas) {
      this.hasLock = true;

      return;
    }

    this.hasLock = false;
  }

  addPointerLock() {
    window.addEventListener("click", handlePointerLock, false);

    window.addEventListener(
      "pointerlockchange",
      this.handleLockRelese.bind(this),
      false,
    );
  }

  handleResize() {
    window.addEventListener("resize", () => {
      this.sizes = initSizes();
      this.renderer.setSize(this.sizes.x, this.sizes.y);
      this.camera.aspect = this.sizes.ratio;
      this.camera.updateProjectionMatrix();
    });
  }

  init() {
    this.world = new World();
  }

  getPlayer() {
    return this.world.player;
  }

  getCamera() {
    return this.camera;
  }

  animate() {
    this.deltaTime = this.clock.getDelta();
    this.elapsedTime = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);

    this.world.animate();
  }
}

export type TGame = typeof Game;
