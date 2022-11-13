// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import Cylinder from "../../shapes/cylinder";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

const kWheels = 4;
const kWheelDistance = 5;
const axisDistance = 8;
const kWheelPoints = 12;
const kBaseSize = [10, 4, 1];

export default class Catapult extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        this.buildWheels(glContext, glProgram);
        this.buildBase(glContext, glProgram);
    }

    private buildWheels(glContext: GlContext, glProgram: GlProgram) {
        const wheelsObj = new CompositeObject(glContext, glProgram);

        for (let i = 0; i < kWheels; ++i) {
            const cylinder = new Cylinder(glContext, glProgram, kWheelPoints);
            const cylinderObj = new SceneObject(glContext, glProgram, cylinder);

            const axis = Math.floor(i / 2);
            const distance = kWheelDistance;
            const cylinderMatrix = mat4.create();
            mat4.fromTranslation(cylinderMatrix, [axis * axisDistance + 1, i % 2 * distance, 0]);
            mat4.rotateX(cylinderMatrix, cylinderMatrix, Math.PI / 2);
            cylinderObj.baseModelMatrix = cylinderMatrix;
            wheelsObj.addChild(cylinderObj);
        }
        this.addChild(wheelsObj);
    }

    private buildBase(glContext: GlContext, glProgram: GlProgram) {
        const base = new Cube(glContext, glProgram);
        const baseObj = new SceneObject(glContext, glProgram, base);

        const catapultBaseMatrix = mat4.create();
        mat4.fromScaling(catapultBaseMatrix, kBaseSize);
        mat4.translate(catapultBaseMatrix, catapultBaseMatrix, [0, 0, -0.25]);
        baseObj.baseModelMatrix = catapultBaseMatrix;
        this.addChild(baseObj);
    }

    private buildFrame(glContext: GlContext, glProgram: GlProgram) {

    }

    private buildArm(glContext: GlContext, glProgram: GlProgram) {

    }
}
