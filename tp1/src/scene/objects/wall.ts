// @ts-ignore
import * as mat2 from "gl-matrix/esm/mat2";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {CubicBezier} from "../../curves/bezier";
import {CompositePath} from "../../curves/path";
import {GlContext, GlProgram} from "../../gl";
import {SweepSurface} from "../../shapes/sweepSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import TextureManager from "../textureManager";

const wallTopHeight = 0.2;

export default class Wall extends CompositeObject {
    public innerWallObj: SceneObject | undefined;
    public outerWallObj: SceneObject | undefined;
    public topObj: SceneObject | undefined;

    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        this.buildWall(glContext, glProgram);
        this.buildTop(glContext, glProgram);
    }

    public applyTextureMatrix(matrix: mat2) {
        this.outerWallObj!.textureMatrix = matrix;
        this.innerWallObj!.textureMatrix = matrix;
        this.topObj!.textureMatrix = matrix;
    }

    private buildTop(glContext: GlContext, glProgram: GlProgram) {
        // TODO: Improve with a linear path
        const path = CubicBezier.from3dPoints([0, 0, 0, 0, 0, 0.33, 0, 0, 0.66, 0, 0, 1], 2);
        const shape = CompositePath.fromPoints([
            [0, 0, 0], [0, 1, 0], [0.25, 1, 0], [0.25, 0.5, 0],
            [0.75, 0.5, 0], [0.75, 1, 0], [1, 1, 0], [1, 0, 0]]);
        const top = new SweepSurface(glContext, glProgram, shape, path);
        top.build();
        top.textureList.push(TextureManager.getTexture("rock-02"));
        this.topObj = new SceneObject(glContext, glProgram, top);
        const objMatrix = mat4.create();
        mat4.fromTranslation(objMatrix, [-1, -1, 0]);
        mat4.scale(objMatrix, objMatrix, [1, wallTopHeight, 1]);
        this.topObj.baseModelMatrix = objMatrix;
        this.addChild(this.topObj);
    }

    private buildWall(glContext: GlContext, glProgram: GlProgram) {
        // TODO: use Extrude or similar
        const path = CubicBezier.from3dPoints([0, 0, 0, 0, 0, 0.33, 0, 0, 0.66, 0, 0, 1], 4);
        const shape = CubicBezier.from2dPoints([[0, 1], [0, 0.6], [0.5, 0.4], [0.5, 0]], 8);
        const wall = new SweepSurface(glContext, glProgram, shape, path);
        wall.build();
        wall.textureList.push(TextureManager.getTexture("rock"));
        this.innerWallObj = new SceneObject(glContext, glProgram, wall);
        this.outerWallObj = new SceneObject(glContext, glProgram, wall);
        const wall2Matrix = mat4.create();
        mat4.fromYRotation(wall2Matrix, Math.PI);
        mat4.translate(wall2Matrix, wall2Matrix, [1, 0, -1]);
        this.innerWallObj.baseModelMatrix = wall2Matrix;
        this.addChild(this.innerWallObj);
        this.addChild(this.outerWallObj);
    }
}
