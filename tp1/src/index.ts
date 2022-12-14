/* eslint no-console:0 consistent-return:0 */
// @ts-ignore
import * as dat from "dat.gui";
import {GlContext, GlProgram} from "./gl";
import {FirstPersonCamera} from "./scene/camera/firstPersonCamera";
import {OrbitalCamera} from "./scene/camera/orbitalCamera";
import Scene from "./scene/scene";
import ShaderManager from "./scene/shaderManager";
import TextureManager from "./scene/textureManager";
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
  await initProgram("base", "./shaders/vertex-base.glsl", "./shaders/fragment-base.glsl", context);
  await initProgram("normals", "./shaders/vertex-base.glsl", "./shaders/fragment-normal.glsl", context);
  await initProgram("grass", "./shaders/vertex-base.glsl", "./shaders/fragment-grass.glsl", context);
  await initProgram("fire", "./shaders/vertex-fire.glsl", "./shaders/fragment-fire.glsl", context);

  context.resizeCanvasToDisplaySize();
  context.clear();

  // Camera init
  fpCamera.registerCallbacks(canvas);
  orbitalCamera.registerCallbacks(canvas);
  // Texture manager init
  TextureManager.init(context);
  // Menu
  initMenu();
  // Scene init
  scene = new Scene(context, orbitalCamera, config);
  window.addEventListener("keydown", (e) => { scene!.keypressListener(e); });
  cameraChanged(config.cameraType.toString());
  // Render loop init
  tick();
}

const fpsInterval = 5000;

function tick() {
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
  murallaFolder.add(config, "gateAngle", 0, 90, 1).name("Angulo de la puerta").onChange(configChanged);
  gui.add(config, "catapultAngle", 0, 360, 3).name("Angulo de la catapulta").onChange(configChanged);
  const camaraFolder = gui.addFolder("C??mara");
  camaraFolder.add(config, "cameraType", {
    "Primera persona": 0,
    "Orbital general": 1,
    "Orbital catapulta": 2,
  })
      .name("Tipo de c??mara")
      .onChange(cameraChanged);
  camaraFolder.add(config, "viewNormals").name("Ver normales").onChange(onShaderConfigChanged);
}

function cameraChanged(value: string) {
  switch (value) {
    case "0":
      scene!.setCamera(fpCamera);
      break;
    case "1":
      orbitalCamera.setCenter([0, 0, 0]);
      scene!.setCamera(orbitalCamera);
      break;
    case "2":
      orbitalCamera.setCenter(scene!.catapultPosition);
      scene!.setCamera(orbitalCamera);
      break;
  }
}

function configChanged() {
  scene!.onConfigChanged();
  scene!.render();
}

function onShaderConfigChanged() {
  scene!.onShaderConfigChanged();
}

// TODO: support other configurations
async function initProgram(name: string, vertexPath: string, fragPath: string, context: GlContext): Promise<GlProgram> {
  const vertexShaderFile = await fetch(vertexPath);
  const vertexShaderSource = await vertexShaderFile.text();
  const fragShaderFile = await fetch(fragPath);
  const fragShaderSource = await fragShaderFile.text();
  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vertexShader = context.createVertexShader(vertexShaderSource);
  const fragmentShader = context.createFragmentShader(fragShaderSource);
  // Link the two shaders into a program
  const program = context.createProgram(vertexShader, fragmentShader);

  ShaderManager.setProgram(name, program);
  return program;
}

window.onload = main;
