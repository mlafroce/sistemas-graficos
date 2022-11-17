// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {CubicBezier} from "../../curves/bezier";
import {CompositePath} from "../../curves/path";
import {GlContext, GlProgram} from "../../gl";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {SweepSurface} from "../../shapes/sweepSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

const wallTopHeight = 0.2;

export default class Wall extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        this.buildWall(glContext, glProgram);
        this.buildTop(glContext, glProgram);
        this.baseColor = vec4.fromValues(0.4, 0.4, 0.4, 1);
    }

    private buildTop(glContext: GlContext, glProgram: GlProgram) {
        // TODO: Improve with a linear path
        const path = CubicBezier.from3dPoints([0, 0, 0, 0, 0, 0.33, 0, 0, 0.66, 0, 0, 1], 8);
        const shape = CompositePath.fromPoints([
            [0, 0, 0], [0, 1, 0], [0.25, 1, 0], [0.25, 0.5, 0],
            [0.75, 0.5, 0], [0.75, 1, 0], [1, 1, 0], [1, 0, 0]]);
        const top = new SweepSurface(glContext, glProgram, shape, path);
        top.build();
        const obj = new SceneObject(glContext, glProgram, top);
        const objMatrix = mat4.create();
        mat4.fromTranslation(objMatrix, [-1, -1, 0]);
        mat4.scale(objMatrix, objMatrix, [1, wallTopHeight, 1]);
        obj.baseModelMatrix = objMatrix;
        this.addChild(obj);
    }

    private buildWall(glContext: GlContext, glProgram: GlProgram) {
        // TODO: use Extrude or similar
        const path = CubicBezier.from3dPoints([0, 0, 0, 0, 0, 0.33, 0, 0, 0.66, 0, 0, 1], 4);
        const shape = CubicBezier.from2dPoints([[0, 1], [0, 0.6], [1, 0.4], [1, 0]], 5);
        const wall = new SweepSurface(glContext, glProgram, shape, path);
        wall.build();
        const wallObj = new SceneObject(glContext, glProgram, wall);
        const wallObj2 = new SceneObject(glContext, glProgram, wall);
        const wall2Matrix = mat4.create();
        mat4.fromYRotation(wall2Matrix, Math.PI);
        mat4.translate(wall2Matrix, wall2Matrix, [1, 0, -1]);
        wallObj2.baseModelMatrix = wall2Matrix;
        this.addChild(wallObj);
        this.addChild(wallObj2);
    }

}
