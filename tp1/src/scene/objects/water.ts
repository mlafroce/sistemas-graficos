// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec2 from "gl-matrix/esm/vec2";
import {CubicBezier} from "../../curves/bezier";
import {GlContext, GlProgram} from "../../gl";
import Perlin2d from "../../noise/perlin2d";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import Texture from "../texture";

const kNoiseSamples = 64;

export default class Water extends CompositeObject {
    private waveNoiseTex1: Texture;
    private waveNoiseTex2: Texture;
    private clock: number = 0;

    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        const shape = CubicBezier.from2dPoints([[0.10, 0.0], [0.4, 0], [0.7, 0], [1, 0]], 16);
        const water = new RevolutionSurface(glContext, glProgram, shape, Math.PI * 2, 17);
        water.build();
        const waterObj = new SceneObject(glContext, glProgram, water);
        waterObj.baseColor = [0.2, 0.2, 0.8, 0.7];
        this.addChild(waterObj);

        const waveNoise1 = Perlin2d.randomSample(8, kNoiseSamples);
        const waveNoise2 = Perlin2d.randomSample(8, kNoiseSamples);
        this.waveNoiseTex1 = Texture.luminanceFromPixelArray(glContext, waveNoise1, kNoiseSamples, kNoiseSamples);
        this.waveNoiseTex2 = Texture.luminanceFromPixelArray(glContext, waveNoise2, kNoiseSamples, kNoiseSamples);

    }

    public render() {
        const gl = this.glContext.gl;
        this.glProgram.activate();
        const clockLoc = this.glProgram.getUniformLocation("clockTick");
        gl.uniform1f(clockLoc, this.clock);
        this.clock++;
        this.waveNoiseTex1.activate(gl.TEXTURE0);
        this.waveNoiseTex2.activate(gl.TEXTURE1);

        super.render();
    }
}
