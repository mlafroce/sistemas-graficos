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
        this.buildBody(config);
    }

    public onConfigChanged(config: Config) {
        super.onConfigChanged(config);
        this.childList.length = 0;
        this.build(config);
    }

    private build(config: Config) {
        this.buildBody(config);
    }

    private buildBody(config: Config) {
        const base = new Cube(this.glContext, this.glProgram);
        const baseObj = new SceneObject(this.glContext, this.glProgram, base);
        const mMatrix = mat4.create();
        mat4.fromScaling(mMatrix, [config.castleWidth, config.castleLength, 1]);
        mat4.translate(mMatrix, mMatrix, [-0.5, -0.5, 0]);
        baseObj.baseModelMatrix = mMatrix;
        baseObj.baseColor = vec4.fromValues(0.8, 0.8, 0.4, 1);
        this.addChild(baseObj);
    }
}
