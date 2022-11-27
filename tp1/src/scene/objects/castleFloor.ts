// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import Window from "./window";

const kWindowDepth = 0.05;
const kWinScale = 0.2;
const kWinDistance = 0.5;

export default class CastleFloor extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        this.buildBody(config);
    }

    public onConfigChanged(config: Config) {
        super.onConfigChanged(config);
        this.childList.length = 0;
        this.build(config);
    }

    private build(config: Config) {
        this.buildBody(config);
    }

    private buildBody(config: Config) {
        const base = new Cube(this.glContext, this.glProgram);
        const baseObj = new SceneObject(this.glContext, this.glProgram, base);
        const mMatrix = mat4.create();
        mat4.fromScaling(mMatrix, [config.castleWidth, config.castleLength, 1]);
        mat4.translate(mMatrix, mMatrix, [-0.5, -0.5, 0]);
        baseObj.baseModelMatrix = mMatrix;
        baseObj.baseColor = vec4.fromValues(0.8, 0.8, 0.4, 1);
        this.addChild(baseObj);
        this.drawWindowsRow(config.castleWidth, config.castleLength, 0);
        this.drawWindowsRow(config.castleLength, config.castleWidth, Math.PI / 2);
        this.drawWindowsRow(config.castleWidth, config.castleLength, Math.PI);
        this.drawWindowsRow(config.castleLength, config.castleWidth, -Math.PI / 2);
    }

    private drawWindowsRow(rowLength: number, wallDistance: number, angle: number) {
        const nWindowsXAxis = Math.floor(rowLength / kWinDistance);
        const wallPadding = (rowLength - (nWindowsXAxis * kWinDistance)) / 2;
        const windowPadding = (kWinDistance - kWinScale) / 2;
        let winPosX = - rowLength / 2 + wallPadding + windowPadding;
        for (let i = 0; i < nWindowsXAxis; i++) {
            const window = new Window(this.glContext, this.glProgram);
            const winMatrix = mat4.create();
            mat4.fromZRotation(winMatrix, angle);
            mat4.translate(winMatrix, winMatrix, [winPosX, wallDistance * 0.5 + kWindowDepth, 0.5]);
            mat4.scale(winMatrix, winMatrix, [kWinScale, kWinScale, kWinScale]);
            mat4.rotateX(winMatrix, winMatrix, Math.PI / 2);
            window.baseModelMatrix = winMatrix;
            window.baseColor = vec4.fromValues(0.8, 0.4, 0.0, 1);
            window.baseModelMatrix = winMatrix;
            this.addChild(window);
            winPosX += kWinDistance;
        }

    }
}
