/* eslint no-console:0 consistent-return:0 */
import {GlContext} from "./gl";
import {MouseCamera} from "./scene/camera";
import Scene from "./scene/scene";
// @ts-ignore
import * as dat from "dat.gui";
import {Config} from "./utils";

let scene: Scene | undefined;

const config: Config = new Config();

async function main() {
  // Get A WebGL context
  const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement | null;
  if (!canvas) {
    throw new Error(`Canvas not found at {path}`);
  }
  const context = new GlContext(canvas);

  // Get the strings for our GLSL shaders
  const vertexShaderFile = await fetch("./src/vertex-base.glsl");
  const vertexShaderSource = await vertexShaderFile.text();
  const fragmentShaderFile = await fetch("./src/fragment-base.glsl");
  const fragmentShaderSource = await fragmentShaderFile.text();

  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vertexShader = context.createVertexShader(vertexShaderSource);
  const fragmentShader = context.createFragmentShader(fragmentShaderSource);

  // Link the two shaders into a program
  const program = context.createProgram(vertexShader, fragmentShader);

  context.resizeCanvasToDisplaySize();
  context.clear();

  // Tell it to use our program (pair of shaders)
  program.use();
  // Camera init
  const camera: MouseCamera = new MouseCamera();
  canvas.addEventListener("wheel", (e) => { camera.wheelListener(e); });
  canvas.addEventListener("mousedown", (e) => { camera.mousedownListener(e); });
  canvas.addEventListener("mousemove", (e) => { camera.mousemoveListener(e); });
  window.addEventListener("keydown", (e) => { camera.keypressListener(e); });
  window.addEventListener("mouseup", (e) => { camera.mouseupListener(e); });

  // Menu
  initMenu();
  // Scene init
  scene = new Scene(context, program, camera, config);
  // Render loop init
  tick();
}

const fpsInterval = 5000;

function tick() {
  /*setTimeout(() => {
    requestAnimationFrame(tick);
  }, fpsInterval);*/
  requestAnimationFrame(tick);
  scene!.updateModel();
  scene!.render();
}

function initMenu() {
  const gui = new dat.GUI();
  gui.add(config, "pisosCastillo", 1, 5, 1).onChange(configChanged);
  gui.add(config, "largoCastillo", 1, 3).onChange(configChanged);
  gui.add(config, "anchoCastillo", 1, 3).onChange(configChanged);
  gui.add(config, "ladosMuralla", 4, 8, 1).onChange(configChanged);
  gui.add(config, "alturaMuralla", 1, 3).onChange(configChanged);
}

function configChanged() {
  scene!.rebuildScene();
  scene!.render();
}

window.onload = main;
