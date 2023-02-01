// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import Cylinder from "../../shapes/cylinder";
import Sphere from "../../shapes/sphere";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import TextureManager from "../textureManager";
import {LightManager} from "../lightManager";

const kWheels = 4;
const kWheelDistance = 5;
const axisDistance = 8;
const kWheelPoints = 12;
const kAxisPoints = 12;
const kBaseSize = [10, 4, 1];
const kRockSize = [0.08, 0.08, 0.08];
const kFrameSideSize = [1, 0.5, 4];
const kArmSize = [10, 1, 0.25];
const kGravity = -0.5;
const kVInit = 1.5;

export default class Catapult extends CompositeObject {
    private animationTime: number = 0;
    private idle: boolean = true;
    private arm: SceneObject | undefined;
    private rock: SceneObject | undefined;
    private weight: CompositeObject | undefined;
    private rockZ = 4;
    private rockX = 0;

    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        this.build(config);
    }

    public onConfigChanged(config: Config) {
        super.onConfigChanged(config);
        this.childList.length = 0;
        this.build(config);

    }

    public launch() {
        this.rockZ = 4;
        this.rockX = 0;
        this.animationTime = 0;
        this.idle = false;
    }

    private build(config: Config) {
        this.buildWheels(this.glContext, this.glProgram);
        this.buildBase(this.glContext, this.glProgram);
        this.buildFrame(this.glContext, this.glProgram);
        this.arm = this.buildArm(this.glContext, this.glProgram);
        this.addChild(this.arm);
        this.weight = this.buildWeight(this.glContext, this.glProgram);
        this.addChild(this.weight);
        this.rock = this.buildRock(this.glContext, this.glProgram);
        this.addChild(this.rock);
        this.updateRockModel();
    }

    public updateRockModel() {
        if (!this.idle) {
            const deltaZ = this.animationTime * this.animationTime * kGravity / 2 + kVInit * this.animationTime;
            this.rockZ += deltaZ;
            this.rockX += this.animationTime * kVInit / 3;
            if (this.rockZ < 0.25) {
                this.rockZ = 0.25;
                this.idle = true;
            }
            this.animationTime += 0.2;
        }
        const rockMatrix = mat4.create();
        mat4.fromTranslation(rockMatrix, [10 - this.rockX, 2, this.rockZ]);
        mat4.scale(rockMatrix, rockMatrix, kRockSize);
        this.rock!.baseModelMatrix = rockMatrix;
    }

    private buildWheels(glContext: GlContext, glProgram: GlProgram) {
        const wheelsObj = new CompositeObject(glContext, glProgram);

        for (let i = 0; i < kWheels; ++i) {
            const cylinder = new Cylinder(glContext, glProgram, kWheelPoints);
            const cylinderObj = new SceneObject(glContext, glProgram, cylinder);

            cylinder.setTexture(TextureManager.getTexture("wheel"));

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
        baseObj.baseColor = [0.6, 0.3, 0, 1.0];

        base.texture = TextureManager.getTexture("wood");

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
        sphere.textureList.push(TextureManager.getTexture("rock"));
        const sphereObj = new SceneObject(glContext, glProgram, sphere);
        return sphereObj;
    }

    public pushLights(lightManager: LightManager) {
        const lightPos = vec3.fromValues(0, 0, 0);
        vec3.transformMat4(lightPos, lightPos, this.rock!.modelMatrix);
        lightManager.registerLight(lightPos);
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
        sideLObj.baseColor = [0.6, 0.3, 0, 1.0];

        side.texture = TextureManager.getTexture("wood");

        this.addChild(sideLObj);

        const sideRObj = new SceneObject(glContext, glProgram, side);
        const sideRBaseMatrix = mat4.clone(sideLBaseMatrix);
        mat4.translate(sideRBaseMatrix, sideRBaseMatrix, [0, 5, 0]);
        sideRObj.baseModelMatrix = sideRBaseMatrix;
        sideRObj.baseColor = [0.6, 0.3, 0, 1.0];
        this.addChild(sideRObj);

        const axis = new Cylinder(glContext, glProgram, kAxisPoints);
        const axisObj = new SceneObject(glContext, glProgram, axis);

        const axisMatrix = mat4.create();
        mat4.fromTranslation(axisMatrix, [2.5, 4, 3]);
        mat4.rotateX(axisMatrix, axisMatrix, Math.PI / 2);
        mat4.scale(axisMatrix, axisMatrix, [0.25, 0.25, 4]);
        axisObj.baseModelMatrix = axisMatrix;
        axisObj.baseColor = [0.4, 0.1, 0, 1.0];
        this.addChild(axisObj);
    }
}
