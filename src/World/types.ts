import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export type TGetTextFunc = (
  text: string,
) => THREE.Mesh<
  TextGeometry,
  THREE.MeshPhongMaterial[],
  THREE.Object3DEventMap
>;
