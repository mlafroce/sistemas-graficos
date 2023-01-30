// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import {CompositeObject} from "../compositeObject";
import {LightManager} from "../lightManager";
import SceneObject from "../sceneObject";
import ShaderManager from "../shaderManager";
import TextureManager from "../textureManager";
import Fire from "./fire";

export default class Torch extends CompositeObject {
    private fire: Fire;

    constructor(glContext: GlContext, glProgram: GlProgram, torchLength: number) {
        super(glContext, glProgram);
        const torch = new Cube(glContext, glProgram);
        const torchObj = new SceneObject(glContext, glProgram, torch);
        torch.texture = TextureManager.getTexture("wood");
        torch.scaleAxisTextures(0, 2, 2);
        const torchMatrix = mat4.create();
        mat4.fromXRotation(torchMatrix, - Math.PI / 6);
        mat4.scale(torchMatrix, torchMatrix, [1, 1, torchLength]);
        torchObj.baseModelMatrix = torchMatrix;
        this.addChild(torchObj);
        // Fire
        const fireProgram = ShaderManager.getProgram("fire");
        this.fire = new Fire(this.glContext, fireProgram);
        const fireMatrix = mat4.create();
        mat4.fromXRotation(fireMatrix, - Math.PI / 6);
        mat4.translate(fireMatrix, fireMatrix, [-0.5, -0.5, torchLength - 1]);
        mat4.rotateX(fireMatrix, fireMatrix, Math.PI / 6);
        mat4.scale(fireMatrix, fireMatrix, [2, 2, 2]);
        this.fire.baseModelMatrix = fireMatrix;
        this.addChild(this.fire);
    }

    public pushLights(lightManager: LightManager) {
        const lightPos = vec3.fromValues(0, 0, 0);
        vec3.transformMat4(lightPos, lightPos, this.fire.modelMatrix);
        lightManager.registerLight(lightPos);
    }
}
