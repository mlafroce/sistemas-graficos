// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {CubicBezier} from "../../curves/bezier";
import {GlContext, GlProgram} from "../../gl";
import {SweepSurface} from "../../shapes/sweepSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

const wallTopHeight = 0.2;

export default class Wall extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        this.buildWall(glContext, glProgram);
        this.buildTop(glContext, glProgram);
        const mMatrix = mat4.create();
        mat4.fromScaling(mMatrix, [1, 0.2, 1]);
        this.baseModelMatrix = mMatrix;
    }

    private buildTop(glContext: GlContext, glProgram: GlProgram) {
        // TODO: Improve with a linear path
        const path = new CubicBezier([0, 0, 0, 0.33, 0, 0, 0.66, 0, 0, 1, 0, 0], 8);
        const shape = [[0, 0, 0], [0, 1, 0], [0.25, 1, 0], [0.25, 0.5, 0],
            [0.75, 0.5, 0], [0.75, 1, 0], [1, 1, 0], [1, 0, 0]];
        const top = new SweepSurface(glContext, glProgram, shape, path);
        top.build();
        const obj = new SceneObject(glContext, glProgram, top);
        const objMatrix = mat4.create();
        mat4.fromTranslation(objMatrix, [0, -1, 1]);
        mat4.scale(objMatrix, objMatrix, [1, 1, wallTopHeight]);
        obj.baseModelMatrix = objMatrix;
        this.addChild(obj);
    }

    private buildWall(glContext: GlContext, glProgram: GlProgram) {
        // TODO: use Extrude or similar
        const path = new CubicBezier([0, 0, 0, 0.33, 0, 0, 0.66, 0, 0, 1, 0, 0], 8);
        const shape = new CubicBezier([1, 0, 0, 1, 0.5, 0, 0, 0.5, 0, 0, 1, 0], 10);
        const wall = new SweepSurface(glContext, glProgram, shape.points, path);
        wall.build();
        const wallObj = new SceneObject(glContext, glProgram, wall);
        const wallObj2 = new SceneObject(glContext, glProgram, wall);
        const wall2Matrix = mat4.create();
        mat4.fromZRotation(wall2Matrix, Math.PI);
        mat4.translate(wall2Matrix, wall2Matrix, [-1, 1, 0]);
        wallObj2.baseModelMatrix = wall2Matrix;
        this.addChild(wallObj);
        this.addChild(wallObj2);
    }

}
