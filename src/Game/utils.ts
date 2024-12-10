import * as THREE from "three";
import { TSizes } from "./types";

export const initSizes = (): TSizes => {
  const sizes = {
    x: window.innerWidth,
    y: window.innerHeight,
    ratio: window.innerWidth / window.innerHeight,
  } as TSizes;

  return sizes;
};

export const initRenderer = (sizes: TSizes): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(sizes.x, sizes.y);
  document.body.appendChild(renderer.domElement);

  return renderer;
};

export const handlePointerLock = async () => {
  try {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
      return;
    }

    canvas.requestPointerLock =
      (canvas as any).requestPointerLock ||
      (canvas as any).mozRequestPointerLock ||
      (canvas as any).webkitRequestPointerLock;

    await canvas.requestPointerLock();
  } catch (error) {
    console.log({ error });
  }
};
