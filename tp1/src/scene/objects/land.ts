// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {CompositePath} from "../../curves/path";
import {GlContext, GlProgram} from "../../gl";
import Perlin2d from "../../noise/perlin2d";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import Texture from "../texture";
import TextureManager from "../textureManager";

export default class Land extends CompositeObject {
    private noiseTexture: Texture;
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        const gl = glContext.gl;
        this.buildCenter(glContext, glProgram);
        this.buildLand(glContext, glProgram);
        const noise = Perlin2d.randomSample(10, 64);
        this.noiseTexture = Texture.luminanceFromPixelArray(glContext, noise, 64, 64);
    }

    private buildCenter(glContext: GlContext, glProgram: GlProgram) {
        const shape = CompositePath.fromPoints([[0, 0.25, 0], [0.29, 0.25, 0], [0.3, 0.25, 0], [0.40, 0, 0]]);
        const center = new RevolutionSurface(glContext, glProgram, shape, Math.PI * 2, 20);
        center.build();
        const centerObj = new SceneObject(glContext, glProgram, center);
        centerObj.baseColor = vec4.fromValues(0.4, 0.8, 0.3, 1);
        this.addChild(centerObj);
    }

    private buildLand(glContext: GlContext, glProgram: GlProgram) {
        const shape = CompositePath.fromPoints([
            [0, 0, 0],
            [0.49, 0, 0], [0.5, 0, 0],
            [0.55, 0.25, 0],
            [0.99, 0.25, 0],
            [1, 0.25, 0],
        ]);
        const land = new RevolutionSurface(glContext, glProgram, shape, Math.PI * 2, 9);
        land.build();
        const landObj = new SceneObject(glContext, glProgram, land);
        landObj.baseColor = vec4.fromValues(0.4, 0.8, 0.4, 1);
        this.addChild(landObj);
    }

    public render() {
        const gl = this.glContext.gl;
        this.glProgram.activate();
        const grassTex = TextureManager.getTexture("grass01");
        grassTex.activate();
        const soilTex = TextureManager.getTexture("soil");
        soilTex.activate(gl.TEXTURE1);
        this.noiseTexture.activate(gl.TEXTURE2);

        super.render();
    }
}
