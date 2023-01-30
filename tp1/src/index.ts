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
  await Promise.all([
    initShader("fragment-base",  "./shaders/fragment-base.glsl", false, context),
    initShader("fragment-fire", "./shaders/fragment-fire.glsl", false, context),
    initShader("fragment-grass", "./shaders/fragment-grass.glsl", false, context),
    initShader("fragment-normal", "./shaders/fragment-normal.glsl", false, context),
    initShader("fragment-water", "./shaders/fragment-water.glsl", false, context),
    initShader("fragment-sky", "./shaders/fragment-sky.glsl", false, context),
    initShader("vertex-fire", "./shaders/vertex-fire.glsl", true, context),
    initShader("vertex-base", "./shaders/vertex-base.glsl", true, context),
    initShader("vertex-water", "./shaders/vertex-water.glsl", true, context),
  ]);

  ShaderManager.initPrograms(context);

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
  const lightFolder = gui.addFolder("Luces");
  lightFolder.add(config, "sunPhi", 0, 90, 3).name("Angulo sol (phi)").onChange(configChanged);
  lightFolder.add(config, "sunTheta", 0, 360, 3).name("Angulo sol (theta)").onChange(configChanged);
  lightFolder.addColor(config, "sunColor").name("Color ambiente").onChange(configChanged);
  const camaraFolder = gui.addFolder("Cámara");
  camaraFolder.add(config, "cameraType", {
    "Primera persona": 0,
    "Orbital general": 1,
    "Orbital catapulta": 2,
  })
      .name("Tipo de cámara")
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
async function initShader(name: string, path: string, isVertex: boolean, context: GlContext) {
  const shaderFile = await fetch(path);
  const shaderSource = await shaderFile.text();
  const shader = isVertex ?
    context.createVertexShader(shaderSource) :
    context.createFragmentShader(shaderSource);
  ShaderManager.setShader(name, shader);
}

window.onload = main;
