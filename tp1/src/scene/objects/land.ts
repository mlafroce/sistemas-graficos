// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {CompositePath} from "../../curves/path";
import {GlContext, GlProgram} from "../../gl";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

export default class Land extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        this.buildCenter(glContext, glProgram);
        this.buildLand(glContext, glProgram);
    }

    private buildCenter(glContext: GlContext, glProgram: GlProgram) {
        const shape = CompositePath.fromPoints([[0, 0.25, 0], [0.34, 0.25, 0], [0.35, 0.25, 0], [0.40, 0, 0]]);
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
}
