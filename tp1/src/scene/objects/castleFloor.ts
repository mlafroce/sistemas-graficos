// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

export default class CastleFloor extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        this.buildBody(glContext, glProgram, config);
    }

    private buildBody(glContext: GlContext, glProgram: GlProgram, config: Config) {
        const base = new Cube(glContext, glProgram);
        const baseObj = new SceneObject(glContext, glProgram, base);
        const mMatrix = mat4.create();
        mat4.fromScaling(mMatrix, [config.castleWidth, config.castleLength, 1]);
        mat4.translate(mMatrix, mMatrix, [-0.5, -0.5, 0]);
        baseObj.baseModelMatrix = mMatrix;
        baseObj.baseColor = vec4.fromValues(0.8, 0.8, 0.4, 1);
        this.addChild(baseObj);
    }
}
