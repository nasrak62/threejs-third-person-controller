import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";
import Game from "../Game";
import {
  createCube,
  createFloor,
  createFront,
  createLine,
  createText,
} from "./utils";
import Player from "../Player";
import { TRapier } from "../Rapier/types";
import { World as PhysicsWorld } from "@dimforge/rapier3d";
import RenderedObject from "../RenderedObject";

export default class World {
  game: Game;
  line: THREE.Line<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.LineBasicMaterial,
    THREE.Object3DEventMap
  >;
  player: Player;
  enemie: THREE.Group<THREE.Object3DEventMap>;
  lookAtObject: THREE.Group<THREE.Object3DEventMap>;
  RAPIER: TRapier | null;
  physicsWorld: PhysicsWorld | null;
  floor: RenderedObject<
    THREE.Mesh<
      THREE.BoxGeometry,
      THREE.MeshBasicMaterial,
      THREE.Object3DEventMap
    >
  >;
  frontObject: RenderedObject<THREE.Group<THREE.Object3DEventMap>>;
  leftObject: RenderedObject<THREE.Group<THREE.Object3DEventMap>>;
  rightObject: RenderedObject<THREE.Group<THREE.Object3DEventMap>>;
  backObject: RenderedObject<THREE.Group<THREE.Object3DEventMap>>;

  constructor() {
    this.game = new Game();
    this.RAPIER = this.game.RAPIER;
    this.physicsWorld = this.game.physicsWorld;
    const scene = this.game.scene;
    this.initSky();

    this.player = new Player();

    const light = new THREE.AmbientLight(0x404040, 1.0); // soft white light
    this.game.scene.add(light);

    this.line = createLine();
    this.game.scene.add(this.line);

    this.floor = createFloor(this.RAPIER, this.physicsWorld, scene);

    this.enemie = createCube(this.getTextFunction(), "enemie", 0x0000ff);

    this.game.scene.add(this.enemie);

    this.frontObject = createFront(
      this.getTextFunction(),
      "front",
      0xff00ff,
      this.RAPIER,
      this.physicsWorld,
      scene,
      new THREE.Vector3(0, 0, -55),
    );

    this.backObject = createFront(
      this.getTextFunction(),
      "back",
      0x0000ff,
      this.RAPIER,
      this.physicsWorld,
      scene,
      new THREE.Vector3(0, 0, 55),
    );

    this.rightObject = createFront(
      this.getTextFunction(),
      "right",
      0x00ffff,
      this.RAPIER,
      this.physicsWorld,
      scene,
      new THREE.Vector3(55, 0, 0),
    );

    this.leftObject = createFront(
      this.getTextFunction(),
      "left",
      0xffff00,
      this.RAPIER,
      this.physicsWorld,
      scene,
      new THREE.Vector3(-55, 0, 0),
    );

    this.lookAtObject = createCube(this.getTextFunction(), "look at", 0xaa4ac3);

    this.game.scene.add(this.lookAtObject);
  }

  initSky() {
    const sky = new Sky();
    sky.scale.setScalar(450000);
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = 1;
    uniforms["rayleigh"].value = 3;
    uniforms["mieCoefficient"].value = 0.005;
    uniforms["mieDirectionalG"].value = 0.7;

    const phi = THREE.MathUtils.degToRad(88);
    const theta = THREE.MathUtils.degToRad(180);
    const sun = new THREE.Vector3();

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);

    this.game.scene.add(sky);
  }

  getTextFunction() {
    return createText(this.game.font);
  }

  animate() {
    if (this.physicsWorld) {
      this.physicsWorld.timestep = Math.min(this.game.deltaTime, 0.1);
      this.physicsWorld.step();
    }

    this.frontObject.animate();
    this.backObject.animate();
    this.leftObject.animate();
    this.rightObject.animate();
    this.floor.animate();
    this.player.animate();

    const points = this.line.geometry.attributes.position.array;
    const direction = this.player.getFrontDirection();

    points[3] = direction.x;
    points[4] = direction.y;
    points[5] = direction.z;

    this.line.geometry.attributes.position.needsUpdate = true;

    if (this.player.playerCamera.lookAt) {
      this.lookAtObject.position.copy(this.player.playerCamera.lookAt);
    }
  }
}
