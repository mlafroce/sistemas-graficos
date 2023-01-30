// @ts-ignore
import * as mat2 from "gl-matrix/esm/mat2";
import {CompositeObject} from "../compositeObject";
import {GlContext, GlProgram} from "../../gl";
import {Config} from "../../utils";
import {CubicBezier} from "../../curves/bezier";
import RevolutionSurface from "../../shapes/revolutionSurface";
import TextureManager from "../textureManager";
import SceneObject from "../sceneObject";

export default class CastleRoof extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        const object = this.buildBody(config);
        this.addChild(object);
    }

    private buildBody(config: Config) {
        const pathCurve = CubicBezier.from2dPoints(
            [[0, 1],
                [0.5, 0.2],
                [0.8, 0.1],
                [1, 0]],
            10);
        const body = new RevolutionSurface(this.glContext, this.glProgram, pathCurve, Math.PI * 2, 5);
        body.build();
        body.textureList.push(TextureManager.getTexture("blue-tile"));
        const object = new SceneObject(this.glContext, this.glProgram, body);
        object.textureMatrix = mat2.fromValues(0, 2, 2, 0);
        return object;
    }
}
