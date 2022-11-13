// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../../gl";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import Wall from "./wall";
import WallTower from "./wallTower";

const kWallRadius = 5;
const kWallWidth = 0.25;
const kTowerWidth = 1;

export default class FortressWall extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        const fortressTowers = config.ladosMuralla;
        const angleStep = Math.PI * 2 / fortressTowers;
        const baseAngle = angleStep / 2;
        // Towers
        for (let i = 0; i < fortressTowers; i++) {
            const tower = new WallTower(glContext, glProgram);
            const mMatrix = mat4.create();
            mat4.fromZRotation(mMatrix, angleStep * i + baseAngle);
            mat4.translate(mMatrix, mMatrix, [kWallRadius, 0, 0]);
            mat4.scale(mMatrix, mMatrix, [kTowerWidth, kTowerWidth, 0.5]);
            mat4.rotateZ(mMatrix, mMatrix, -angleStep * i + baseAngle);
            tower.baseModelMatrix = mMatrix;
            this.addChild(tower);
        }
        // Walls
        for (let i = 0; i < fortressTowers - 1; i++) {
            const tower = new Wall(glContext, glProgram);
            const mMatrix = mat4.create();
            mat4.fromZRotation(mMatrix, angleStep * i + baseAngle);
            mat4.translate(mMatrix, mMatrix, [kWallRadius + (kTowerWidth - kWallWidth) / 2, 0, 0]);
            const wallAngle = - (Math.PI - angleStep) / 2;
            mat4.rotateZ(mMatrix, mMatrix, wallAngle);
            const wallLength = this.getWallLength(angleStep, kWallRadius);
            mat4.scale(mMatrix, mMatrix, [wallLength, kWallWidth, 1.5]);
            mat4.translate(mMatrix, mMatrix, [-1, 0, 0]);
            tower.baseModelMatrix = mMatrix;
            this.addChild(tower);
        }
    }

    private getWallLength(angle: number, radius: number) {
        const s = Math.sin(angle / 2);
        return s * radius * 2;
    }
}
