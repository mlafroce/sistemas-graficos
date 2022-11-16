// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {CubicBezier} from "../../curves/bezier";
import {CompositePath} from "../../curves/path";
import {GlContext, GlProgram} from "../../gl";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

const bodySRadius = 0.5;
const bodyLRadius = 0.95;

export default class CastleTower extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        this.buildRoof(glContext, glProgram, config);
        this.buildBody(glContext, glProgram, config);
    }

    private buildRoof(glContext: GlContext, glProgram: GlProgram, config: Config) {
        const curve = new CubicBezier([1, 0, 0, 0, 0, 0.5, 0.1, 0, 1, 0, 0, 1], 10);
        const roof = new RevolutionSurface(glContext, glProgram, curve, Math.PI * 2, 20);
        roof.build();
        const roofObj = new SceneObject(glContext, glProgram, roof);
        const roofMatrix = mat4.create();
        mat4.fromTranslation(roofMatrix, [0, 0, config.castleFloors + 0.5]);
        roofObj.baseModelMatrix = roofMatrix;
        roofObj.baseColor = vec4.fromValues(0.4, 0.4, 0.8, 1);

        this.addChild(roofObj);
    }

    private buildBody(glContext: GlContext, glProgram: GlProgram, config: Config) {
        const bodyPath = new CompositePath();
        bodyPath.addPath(CompositePath.fromPoints([
            [bodySRadius, 0, 0],
            [bodySRadius, 0, config.castleFloors - 0.5],
        ]));
        console.log("Castle tower body: ", bodyPath);
        const curve = new CubicBezier(
            [bodySRadius, 0, config.castleFloors - 0.5,
                bodySRadius, 0, config.castleFloors - 0.25,
                bodyLRadius, 0, config.castleFloors + 0.25,
                bodyLRadius, 0, config.castleFloors + 0.25],
            10);
        bodyPath.addPath(curve);
        bodyPath.addPath(CompositePath.fromPoints([
            [bodyLRadius, 0, config.castleFloors + 0.25],
            [bodyLRadius, 0, config.castleFloors + 0.5],
        ]));

        const body = new RevolutionSurface(glContext, glProgram, bodyPath, Math.PI * 2, 10);
        body.build();
        const bodyObj = new SceneObject(glContext, glProgram, body);
        bodyObj.baseColor = vec4.fromValues(0.8, 0.8, 0.4, 1);
        this.addChild(bodyObj);
    }
}
