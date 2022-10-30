/* eslint no-console:0 consistent-return:0 */
import {GlContext} from "./gl";
import {MouseCamera} from "./scene/camera";
import Scene from "./scene/scene";

let scene: Scene | undefined;

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
  window.addEventListener("mouseup", (e) => { camera.mouseupListener(e); });

  // Scene init
  scene = new Scene(context, program, camera);
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

window.onload = main;
