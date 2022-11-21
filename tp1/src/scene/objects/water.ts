// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec2 from "gl-matrix/esm/vec2";
import {CubicBezier} from "../../curves/bezier";
import {GlContext, GlProgram} from "../../gl";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

export default class Water extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        const shape = CubicBezier.from2dPoints([[0.10, 0], [0.4, 0], [0.7, 0], [1, 0]], 8);
        const water = new RevolutionSurface(glContext, glProgram, shape, Math.PI * 2, 9);
        water.build();
        const waterObj = new SceneObject(glContext, glProgram, water);

        waterObj.baseColor = [0.2, 0.2, 0.8, 1];
        this.addChild(waterObj);
    }
}
