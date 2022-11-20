// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import Wall from "./wall";

export default class FortressDoor extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config, wallWidth: number) {
        super(glContext, glProgram);
        const wallR = new Wall(glContext, glProgram);
        const wallMatrix = mat4.create();
        mat4.fromScaling(wallMatrix, [wallWidth, 1, 1]);
        wallR.setBaseModelMatrix(wallMatrix);
        this.addChild(wallR);
        const wallL = new Wall(glContext, glProgram);
        const wallLMatrix = mat4.create();
        mat4.fromScaling(wallLMatrix, [wallWidth, 1, 1]);
        mat4.translate(wallLMatrix, wallLMatrix, [0, 0, 2]);
        wallL.setBaseModelMatrix(wallLMatrix);
        this.addChild(wallL);
        this.buildGate(glContext, glProgram, config, wallWidth);
    }

    private buildGate(glContext: GlContext, glProgram: GlProgram, config: Config, wallWidth: number) {
        const gateWall = new Cube(glContext, glProgram);
        const gateWallObj = new SceneObject(glContext, glProgram, gateWall);

        const wallMatrix = mat4.create();
        mat4.fromTranslation(wallMatrix, [-0.6, -1.5, 1]);
        mat4.scale(wallMatrix, wallMatrix, [1, 1.5, 0.2]);
        gateWallObj.baseModelMatrix = wallMatrix;
        this.addChild(gateWallObj);

        const gateWallRObj = new SceneObject(glContext, glProgram, gateWall);
        const wallRMatrix = mat4.create();
        mat4.fromTranslation(wallRMatrix, [-0.6, -1.5, 1.8]);
        mat4.scale(wallRMatrix, wallRMatrix, [1, 1.5, 0.2]);
        gateWallRObj.baseModelMatrix = wallRMatrix;
        this.addChild(gateWallRObj);

        const gateRoofObj = new SceneObject(glContext, glProgram, gateWall);
        const roofMatrix = mat4.create();
        mat4.fromTranslation(roofMatrix, [-0.6, -1.7, 1]);
        mat4.scale(roofMatrix, roofMatrix, [1, 0.2, 1]);
        gateRoofObj.baseModelMatrix = roofMatrix;
        this.addChild(gateRoofObj);

        const doorObj = new SceneObject(glContext, glProgram, gateWall);
        const doorMatrix = mat4.create();
        mat4.fromTranslation(doorMatrix, [0.45, 0, 0]);
        mat4.rotateZ(doorMatrix, doorMatrix, - Math.PI * config.gateAngle / 180);
        mat4.translate(doorMatrix, doorMatrix, [0, -0.1, 1.2]);
        mat4.scale(doorMatrix, doorMatrix, [1.5, 0.1, 0.6]);
        doorObj.baseModelMatrix = doorMatrix;
        doorObj.baseColor = [0.7, 0.4, 0, 1.0];
        this.addChild(doorObj);
    }
}
