/* eslint no-console:0 consistent-return:0 */
// @ts-ignore
import * as dat from "dat.gui";
import {GlContext} from "./gl";
import {FirstPersonCamera} from "./scene/camera/firstPersonCamera";
import {OrbitalCamera} from "./scene/camera/orbitalCamera";
import Scene from "./scene/scene";
import {Config} from "./utils";

let scene: Scene | undefined;
const fpCamera = new FirstPersonCamera();
const orbitalCamera = new OrbitalCamera();

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
  fpCamera.registerCallbacks(canvas);
  orbitalCamera.registerCallbacks(canvas);
  // Menu
  initMenu();
  // Scene init
  scene = new Scene(context, program, fpCamera, config);
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
  const castilloFolder = gui.addFolder("Castillo");
  castilloFolder.add(config, "castleFloors", 1, 5, 1).name("Pisos").onChange(configChanged);
  castilloFolder.add(config, "castleLength", 1, 3).name("Largo").onChange(configChanged);
  castilloFolder.add(config, "castleWidth", 1, 3).name("Ancho").onChange(configChanged);
  const murallaFolder = gui.addFolder("Muralla");
  murallaFolder.add(config, "nWalls", 4, 8, 1).name("Cantidad de muros").onChange(configChanged);
  murallaFolder.add(config, "wallHeight", 1, 2).name("Alto").onChange(configChanged);
  const camaraFolder = gui.addFolder("Cámara");
  camaraFolder.add(config, "cameraType", {"Primera persona": 0, "Orbital": 1})
      .name("Tipo de cámara")
      .onChange(cameraChanged);
}

function cameraChanged(value: string) {
  switch (value) {
    case "0":
      scene!.setCamera(fpCamera);
      break;
    case "1":
      scene!.setCamera(orbitalCamera);
      break;
  }
}

function configChanged() {
  scene!.rebuildScene();
  scene!.render();
}

window.onload = main;
