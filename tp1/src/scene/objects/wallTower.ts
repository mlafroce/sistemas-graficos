// @ts-ignore
import * as mat2 from "gl-matrix/esm/mat2";
import {CubicBezier} from "../../curves/bezier";
import {CompositePath} from "../../curves/path";
import {GlContext, GlProgram} from "../../gl";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import TextureManager from "../textureManager";

const bodySRadius = 0.7;
const bodyMRadius = 0.8;
const bodyLRadius = 1;
const kTowerHeight = 5;

export default class WallTower extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        const body = this.buildBody(glContext, glProgram, config);
        body.textureMatrix = mat2.fromValues(2, 0, 0, 2);
        this.addChild(body);
    }

    private buildBody(glContext: GlContext, glProgram: GlProgram, config: Config): SceneObject {
        const path = new CompositePath();
        const towerHeight = kTowerHeight * config.wallHeight;
        const wallTopPath = CompositePath.fromPoints([
            [0, towerHeight + 0.5, 0],
            [bodySRadius - 0.01, towerHeight + 0.5, 0],
            [bodySRadius, towerHeight + 0.5, 0],
            [bodySRadius, towerHeight + 0.9, 0],
            [bodySRadius, towerHeight + 1, 0],
            [bodyMRadius - 0.01, towerHeight + 1, 0],
            [bodyMRadius, towerHeight + 1, 0],
            [bodyMRadius, towerHeight + 0.99, 0],
        ]);
        path.addPath(wallTopPath);
        const pathCurve = CubicBezier.from2dPoints(
            [[bodyMRadius, towerHeight],
                [bodySRadius * 0.5, 0.8 * towerHeight],
                [bodyLRadius, 0.5 * towerHeight],
                [bodyLRadius, 0]],
                8);
        path.addPath(pathCurve);

        const body = new RevolutionSurface(glContext, glProgram, path, Math.PI * 2, 10);
        body.build();
        body.textureList.push(TextureManager.getTexture("stone"));
        return new SceneObject(glContext, glProgram, body);
    }
}
