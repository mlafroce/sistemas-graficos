import {CubicBezier} from "../../curves/bezier";
import {GlContext, GlProgram} from "../../gl";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

const bodySRadius = 0.7;
const bodyMRadius = 0.8;
const bodyLRadius = 1;
const towerHeight = 5;

export default class WallTower extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        this.buildBody(glContext, glProgram);
    }

    private buildBody(glContext: GlContext, glProgram: GlProgram) {
        const path = new Array();
        const pathCurve = new CubicBezier(
            [bodyLRadius, 0, 0,
                bodyLRadius, 0, 0.5 * towerHeight,
                bodySRadius * 0.5, 0, 0.8 * towerHeight,
                bodyMRadius, 0, towerHeight],
            8);
        path.push(...pathCurve.points);
        const wallTopPoints = [
            [bodyMRadius, 0, towerHeight + 1],
            [bodySRadius, 0, towerHeight + 1],
            [bodySRadius, 0, towerHeight + 0.5],
            [0, 0, towerHeight + 0.5],
        ];
        path.push(...wallTopPoints);

        const body = new RevolutionSurface(glContext, glProgram, path, Math.PI * 2, 20);
        body.build();
        const bodyObj = new SceneObject(glContext, glProgram, body);
        this.addChild(bodyObj);
    }
}
