// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import TextureManager from "../textureManager";
import Torch from "./torch";
import Wall from "./wall";

export default class FortressDoor extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config, wallWidth: number, wallLength: number) {
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
        this.buildGate(glContext, glProgram, config, wallLength);
        this.buildTorches(wallLength);
    }

    private buildGate(glContext: GlContext, glProgram: GlProgram, config: Config, wallLength: number) {
        const gateWall = new Cube(glContext, glProgram);
        gateWall.texture = TextureManager.getTexture("stone");
        gateWall.scaleAxisTextures(0, 0.5, 1);
        gateWall.scaleAxisTextures(2, 0.5, 0.5);
        const gateWallObj = new SceneObject(glContext, glProgram, gateWall);
        const wallMatrix = mat4.create();
        mat4.fromTranslation(wallMatrix, [-0.6, -1.5, 1]);
        mat4.scale(wallMatrix, wallMatrix, [1, 1.5, 0.2]);
        gateWallObj.baseModelMatrix = wallMatrix;
        gateWallObj.textureMatrix = [0, 1, 1, 0];
        this.addChild(gateWallObj);

        const gateWallRObj = new SceneObject(glContext, glProgram, gateWall);
        const wallRMatrix = mat4.create();
        mat4.fromTranslation(wallRMatrix, [-0.6, -1.5, 1.8]);
        mat4.scale(wallRMatrix, wallRMatrix, [1, 1.5, 0.2]);
        gateWallRObj.baseModelMatrix = wallRMatrix;
        gateWallRObj.textureMatrix = [0, 1, 1, 0];
        this.addChild(gateWallRObj);

        const gateRoof = new Cube(glContext, glProgram);
        gateRoof.texture = TextureManager.getTexture("stone");
        gateRoof.scaleAxisTextures(0, wallLength / 3, 0.2);
        gateRoof.scaleAxisTextures(2, wallLength / 3, 0.2);
        const gateRoofObj = new SceneObject(glContext, glProgram, gateRoof);
        const roofMatrix = mat4.create();
        mat4.fromTranslation(roofMatrix, [-0.6, -1.7, 1]);
        mat4.scale(roofMatrix, roofMatrix, [1, 0.2, 1]);
        gateRoofObj.baseModelMatrix = roofMatrix;
        this.addChild(gateRoofObj);

        const door = new Cube(glContext, glProgram);
        door.texture = TextureManager.getTexture("wood");
        door.scaleAxisTextures(2, 0.1, 1);
        const doorObj = new SceneObject(glContext, glProgram, door);
        doorObj.textureMatrix = [0, 1, 1, 0];
        doorObj.shininess = 10;
        doorObj.reflectionCoef = config.doorReflectiveness;
        door.scaleAxisTextures(0, 1, 0.1);
        const doorMatrix = mat4.create();
        mat4.fromTranslation(doorMatrix, [0.45, 0, 0]);
        mat4.rotateZ(doorMatrix, doorMatrix, - Math.PI * config.gateAngle / 180);
        mat4.translate(doorMatrix, doorMatrix, [0, -0.1, 1.2]);
        mat4.scale(doorMatrix, doorMatrix, [1.5, 0.1, 0.6]);
        doorObj.baseModelMatrix = doorMatrix;
        doorObj.baseColor = [0.7, 0.4, 0, 1.0];
        this.addChild(doorObj);
    }

    private buildTorches(wallLength: number) {
        const torchA = this.buildTorch(wallLength, [0.4, -1, 1.1]);
        this.addChild(torchA);
        const torchB = this.buildTorch(wallLength, [0.4, -1, 1.9]);
        this.addChild(torchB);
    }

    private buildTorch(wallLength: number, torchPos: number[]) {
        const torch = new Torch(this.glContext, this.glProgram, 3);
        const torchMatrix = mat4.create();
        mat4.identity(torchMatrix);
        mat4.translate(torchMatrix, torchMatrix, torchPos);
        mat4.rotateY(torchMatrix, torchMatrix, Math.PI / 2);
        mat4.rotateX(torchMatrix, torchMatrix, Math.PI / 2);
        mat4.scale(torchMatrix, torchMatrix, [0.2 / wallLength, 0.1, 0.1]);
        torch.baseModelMatrix = torchMatrix;
        return torch;
    }
}
