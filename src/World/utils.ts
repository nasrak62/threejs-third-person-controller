import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Font } from "three/examples/jsm/Addons.js";
import { TGetTextFunc } from "./types";
import { TRapier } from "../Rapier/types";
import { World as PhysicsWorld } from "@dimforge/rapier3d";
import RenderedObject from "../RenderedObject";

export const FRICTION = 11;

export const createPlayer = (
  RAPIER: TRapier | null,
  world: PhysicsWorld | null,
  scene: THREE.Scene,
) => {
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cubeFace = new THREE.Mesh(geometry, material);
  const cubeBody = new THREE.Mesh(geometry, material);
  const cubeNose = new THREE.Mesh(geometry, material);

  group.add(cubeFace);
  group.add(cubeBody);
  group.add(cubeNose);

  group.children[0].position.set(0, 0, 0);
  group.children[1].position.set(0, 1, 0);
  group.children[2].position.set(0, 1, -1);

  const spherePoints = [] as THREE.Vector3[];
  let points = [] as unknown as Float32Array;

  for (const children of group.children) {
    const positions = (children as THREE.Mesh).geometry.attributes.position
      .array;

    points = [...new Float32Array(positions)] as unknown as Float32Array;
    const count = positions.length;

    for (let index = 0; index < count; index += 3) {
      const x = positions[index + 0];
      const y = positions[index + 1];
      const z = positions[index + 2];

      spherePoints.push(new THREE.Vector3(x, y, z));
    }
  }

  const sphere = new THREE.Sphere().setFromPoints(spherePoints);

  const renderedObject = new RenderedObject({ mesh: group });

  if (world && RAPIER) {
    renderedObject.body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, 0, 0)
        .setCanSleep(false)
        .lockRotations(),
    );

    let shape = RAPIER.ColliderDesc.convexHull(points)?.setMass(5) || null;

    if (!shape) {
      shape = RAPIER.ColliderDesc.capsule(sphere.radius, sphere.radius).setMass(
        5,
      );
    }

    renderedObject.shape = shape;

    renderedObject.collider = world.createCollider(
      renderedObject.shape,
      renderedObject.body,
    );
  }

  scene.add(group);

  return renderedObject;
};

export const createText = (font: Font) => (text: string) => {
  const geometry = new TextGeometry(text, {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 0.5,
    bevelSize: 0.3,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
  ];

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.name = "text";

  return mesh;
};

export const createCube = (
  textFunc: TGetTextFunc,
  textName: string,
  color: string | number,
) => {
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color });
  const enemie = new THREE.Mesh(geometry, material);
  const text = textFunc(textName);

  group.add(enemie);
  group.add(text);

  group.children[1].position.set(-1, 1, 0);
  group.position.set(5, 0, 5);

  return group;
};

export const createFront = (
  textFunc: TGetTextFunc,
  textName: string,
  color: string | number,
  RAPIER: TRapier | null,
  world: PhysicsWorld | null,
  scene: THREE.Scene,
  basePosition: THREE.Vector3,
) => {
  const size = 20;
  const halfSize = size * 0.5;
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const enemie = new THREE.Mesh(geometry, material);
  const text = textFunc(textName);

  group.add(enemie);
  group.add(text);

  group.children[1].position.set(-1, 1, 0);

  const renderedObject = new RenderedObject({ mesh: group });

  if (world && RAPIER) {
    renderedObject.body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(basePosition.x, basePosition.y, basePosition.z)
        .setCanSleep(false),
    );

    renderedObject.shape = RAPIER.ColliderDesc.cuboid(
      halfSize,
      halfSize,
      halfSize,
    ).setMass(1);

    renderedObject.collider = world.createCollider(
      renderedObject.shape,
      renderedObject.body,
    );
  }

  scene.add(group);

  return renderedObject;
};

export const createLine = () => {
  const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0)];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
  });

  const line = new THREE.Line(lineGeometry, lineMaterial);

  return line;
};

export const createFloor = (
  RAPIER: TRapier | null,
  world: PhysicsWorld | null,
  scene: THREE.Scene,
) => {
  const floorWidth = 1000.0;
  const geometry = new THREE.BoxGeometry(floorWidth, 1, floorWidth);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.y = -1;

  const renderedObject = new RenderedObject({ mesh });

  if (RAPIER && world) {
    renderedObject.shape = RAPIER.ColliderDesc.cuboid(
      floorWidth * 0.5,
      1,
      floorWidth * 0.5,
    ).setFriction(FRICTION);

    renderedObject.body = world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0),
    );

    renderedObject.collider = world.createCollider(
      renderedObject.shape,
      renderedObject.body,
    );
  }

  scene.add(mesh);

  return renderedObject;
};
