// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import Cylinder from "../../shapes/cylinder";
import Sphere from "../../shapes/sphere";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";

const kWheels = 4;
const kWheelDistance = 5;
const axisDistance = 8;
const kWheelPoints = 12;
const kAxisPoints = 12;
const kBaseSize = [10, 4, 1];
const kRockSize = [0.08, 0.08, 0.08];
const kFrameSideSize = [1, 0.5, 4];
const kArmSize = [10, 1, 0.25];
const kGravity = -0.98;
const kVInit = 4;

export default class Catapult extends CompositeObject {
    private animationTime: number = 0;
    private idle: boolean = true;
    private arm: SceneObject;
    private rock: SceneObject;
    private weight: CompositeObject;

    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        this.buildWheels(glContext, glProgram);
        this.buildBase(glContext, glProgram);
        this.buildFrame(glContext, glProgram);
        this.arm = this.buildArm(glContext, glProgram);
        this.addChild(this.arm);
        this.weight = this.buildWeight(glContext, glProgram);
        this.addChild(this.weight);
        this.rock = this.buildRock(glContext, glProgram);
        this.addChild(this.rock);
        this.updateRockModel();
    }

    public launch() {
        this.animationTime = 0;
        this.idle = false;
    }

    public updateRockModel() {
        let rockZ = 4;
        let rockX = 0;
        if (!this.idle) {
            const deltaZ = this.animationTime * this.animationTime * kGravity / 2 + kVInit * this.animationTime;
            rockZ += deltaZ;
            rockX += this.animationTime * kVInit / 2;
            if (rockZ < 0.25) {
                rockZ = 0.25;
                this.idle = true;
            }
            this.animationTime += 0.2;
        }
        const rockMatrix = mat4.create();
        mat4.fromTranslation(rockMatrix, [10 - rockX, 2, rockZ]);
        mat4.scale(rockMatrix, rockMatrix, kRockSize);
        this.rock.baseModelMatrix = rockMatrix;
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
        const frame = new CatapultFrame(glContext, glProgram);
        this.addChild(frame);
    }

    private buildArm(glContext: GlContext, glProgram: GlProgram): SceneObject {
        const arm = new Cube(glContext, glProgram);
        const armObj = new SceneObject(glContext, glProgram, arm);
        const armMatrix = mat4.create();
        mat4.fromTranslation(armMatrix, [0.5, 1.5, 3]);
        mat4.scale(armMatrix, armMatrix, kArmSize);
        armObj.baseModelMatrix = armMatrix;
        return armObj;
    }

    private buildWeight(glContext: GlContext, glProgram: GlProgram): CompositeObject {
        const cube = new Cube(glContext, glProgram);
        const cubeObj = new SceneObject(glContext, glProgram, cube);
        const weightObj = new CompositeObject(glContext, glProgram);
        const grip = new CatapultFrame(glContext, glProgram);
        const gripMatrix = mat4.create();
        mat4.fromTranslation(gripMatrix, [0, 0, 1]);
        mat4.scale(gripMatrix, gripMatrix, [0.25, 0.25, 0.25]);
        grip.baseModelMatrix = gripMatrix;
        weightObj.addChild(cubeObj);
        weightObj.addChild(grip);
        const weightMatrix = mat4.create();
        mat4.fromTranslation(weightMatrix, [0, 1.5, 1.4]);
        weightObj.baseModelMatrix = weightMatrix;
        return weightObj;
    }

    private buildRock(glContext: GlContext, glProgram: GlProgram): SceneObject {
        const sphere = new Sphere(glContext, glProgram, 10, 10, 10);
        sphere.build();
        const sphereObj = new SceneObject(glContext, glProgram, sphere);
        return sphereObj;
    }
}

class CatapultFrame extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        const side = new Cube(glContext, glProgram);
        const sideLObj = new SceneObject(glContext, glProgram, side);
        const sideLBaseMatrix = mat4.create();
        mat4.fromScaling(sideLBaseMatrix, kFrameSideSize);
        mat4.translate(sideLBaseMatrix, sideLBaseMatrix, [2, 1, 0]);
        sideLObj.baseModelMatrix = sideLBaseMatrix;
        this.addChild(sideLObj);

        const sideRObj = new SceneObject(glContext, glProgram, side);
        const sideRBaseMatrix = mat4.clone(sideLBaseMatrix);
        mat4.translate(sideRBaseMatrix, sideRBaseMatrix, [0, 5, 0]);
        sideRObj.baseModelMatrix = sideRBaseMatrix;
        this.addChild(sideRObj);

        const axis = new Cylinder(glContext, glProgram, kAxisPoints);
        const axisObj = new SceneObject(glContext, glProgram, axis);

        const axisMatrix = mat4.create();
        mat4.fromTranslation(axisMatrix, [2.5, 4, 3]);
        mat4.rotateX(axisMatrix, axisMatrix, Math.PI / 2);
        mat4.scale(axisMatrix, axisMatrix, [0.25, 0.25, 4]);
        axisObj.baseModelMatrix = axisMatrix;
        this.addChild(axisObj);
    }
}
