import * as THREE from "three";
import Game from "./Game";
import "./style.css";

const start = async () => {
  const game = new Game();

  game.font = await game.loadFonts();

  game.init();

  game.renderer.setAnimationLoop(game.animate.bind(game));

  (window as any).THREE = THREE;

  (window as any).player = game.getPlayer();
  (window as any).camera = game.getCamera();
};

start();
