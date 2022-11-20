// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../../gl";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import FortressDoor from "./fortressDoor";
import Wall from "./wall";
import WallTower from "./wallTower";

const kWallRadius = 5;
const kWallWidth = 0.2;
const kTowerWidth = 0.8;
const kTowerHeight = 0.2;

export default class FortressWall extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        const fortressTowers = config.nWalls;
        const angleStep = Math.PI * 2 / fortressTowers;
        const baseAngle = angleStep / 2;
        // Towers
        for (let i = 0; i < fortressTowers; i++) {
            const tower = new WallTower(glContext, glProgram, config);
            const mMatrix = mat4.create();
            mat4.fromZRotation(mMatrix, angleStep * i + baseAngle);
            mat4.translate(mMatrix, mMatrix, [kWallRadius, 0, 0]);
            mat4.scale(mMatrix, mMatrix, [kTowerWidth, kTowerWidth, kTowerHeight]);
            mat4.rotateZ(mMatrix, mMatrix, -angleStep * i + baseAngle);
            tower.baseModelMatrix = mMatrix;
            this.addChild(tower);
        }
        // Walls
        for (let i = 0; i < fortressTowers - 1; i++) {
            const wall = new Wall(glContext, glProgram);
            const wallLength = this.getWallLength(angleStep, kWallRadius);
            const mMatrix = mat4.create();
            mat4.fromZRotation(mMatrix, angleStep * i + baseAngle);
            mat4.translate(mMatrix, mMatrix, [kWallRadius + kWallWidth / 2 , kWallWidth / 2, 0]);
            const wallAngle = -(Math.PI - angleStep) / 2;
            mat4.rotateZ(mMatrix, mMatrix, wallAngle);
            mat4.scale(mMatrix, mMatrix, [wallLength, kWallWidth, config.wallHeight / 2]);
            mat4.rotateZ(mMatrix, mMatrix, Math.PI / 2);
            mat4.rotateX(mMatrix, mMatrix, -Math.PI / 2);
            wall.baseModelMatrix = mMatrix;
            this.addChild(wall);
        }
        // Entrance door
        const door = new FortressDoor(glContext, glProgram, config, kWallWidth);
        const doorMatrix = mat4.create();
        mat4.fromZRotation(doorMatrix, -baseAngle);
        const wallLength = this.getWallLength(angleStep, kWallRadius);
        mat4.translate(doorMatrix, doorMatrix, [kWallRadius, 0, 0]);
        const wallAngle = -(Math.PI - angleStep) / 2;
        mat4.rotateZ(doorMatrix, doorMatrix, wallAngle);
        mat4.scale(doorMatrix, doorMatrix, [wallLength / 3, 1, config.wallHeight / 2]);
        mat4.rotateZ(doorMatrix, doorMatrix, Math.PI / 2);
        mat4.rotateX(doorMatrix, doorMatrix, -Math.PI / 2);
        door.setBaseModelMatrix(doorMatrix);
        this.addChild(door);
    }

    private getWallLength(angle: number, radius: number) {
        const s = Math.sin(angle / 2);
        return s * radius * 2;
    }
}
