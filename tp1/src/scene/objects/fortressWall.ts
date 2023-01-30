// @ts-ignore
import * as mat2 from "gl-matrix/esm/mat2";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import TextureManager from "../textureManager";
import FortressDoor from "./fortressDoor";
import Wall from "./wall";
import WallTower from "./wallTower";

const kWallRadius = 5;
const kWallWidth = 0.5;
const kTowerWidth = 0.8;
const kTowerHeight = 0.2;

export default class FortressWall extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        this.build(config);
    }

    public onConfigChanged(config: Config) {
        super.onConfigChanged(config);
        this.childList.length = 0;
        this.build(config);
    }

    private build(config: Config) {
        const fortressTowers = config.nWalls;
        const angleStep = Math.PI * 2 / fortressTowers;
        const baseAngle = angleStep / 2;
        // Towers
        for (let i = 0; i < fortressTowers; i++) {
            const tower = new WallTower(this.glContext, this.glProgram, config);
            const mMatrix = mat4.create();
            mat4.fromZRotation(mMatrix, angleStep * i + baseAngle);
            mat4.translate(mMatrix, mMatrix, [kWallRadius, 0, 0]);
            mat4.scale(mMatrix, mMatrix, [kTowerWidth, kTowerWidth, kTowerHeight]);
            mat4.rotateZ(mMatrix, mMatrix, -angleStep * i + baseAngle);
            tower.baseModelMatrix = mMatrix;
            tower.textureMatrix = mat2.fromValues(1, 0, 0, 1);
            this.addChild(tower);
        }
        // Walls
        for (let i = 0; i < fortressTowers - 1; i++) {
            const wall = new Wall(this.glContext, this.glProgram);
            const wallLength = this.getWallLength(angleStep, kWallRadius);
            const mMatrix = mat4.create();
            mat4.fromZRotation(mMatrix, angleStep * i + baseAngle);
            mat4.translate(mMatrix, mMatrix, [kWallRadius + kWallWidth / 4 , kWallWidth / 4, 0]);
            const wallAngle = -(Math.PI - angleStep) / 2;
            mat4.rotateZ(mMatrix, mMatrix, wallAngle);
            mat4.scale(mMatrix, mMatrix, [wallLength, kWallWidth, config.wallHeight / 2]);
            mat4.rotateZ(mMatrix, mMatrix, Math.PI / 2);
            mat4.rotateX(mMatrix, mMatrix, -Math.PI / 2);
            wall.baseModelMatrix = mMatrix;

            // Stretch Y coord and rotate 90 degrees
            wall.applyTextureMatrix(mat2.fromValues(0, 1, wallLength, 0));

            this.addChild(wall);
        }
        // Entrance door
        const wallLength = this.getWallLength(angleStep, kWallRadius);
        const door = new FortressDoor(this.glContext, this.glProgram, config, kWallWidth, wallLength);
        const doorMatrix = mat4.create();
        mat4.fromZRotation(doorMatrix, -baseAngle);
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
