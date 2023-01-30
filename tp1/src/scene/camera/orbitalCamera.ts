// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {Camera} from "./firstPersonCamera";

export class OrbitalCamera implements Camera {
    private readonly cameraSpeed: number = 100;
    private mouseDown: boolean = false;
    private basePosition: vec3;
    private up: vec3;
    private xRotation: number = 0;
    private zRotation: number = 0;
    private center: vec3;

    constructor() {
        this.basePosition = vec3.fromValues(0, 10, -5);
        this.center = vec3.fromValues(0, 0, 0);
        this.up = vec3.fromValues(0, 0, 1);
    }

    public wheelListener(e: WheelEvent) {
        const deltaPos = e.deltaY / this.cameraSpeed;
        if ((deltaPos > 0 && this.basePosition[1] > 2) || (deltaPos < 0 && this.basePosition[1] < 30)) {
            this.basePosition[1] -= deltaPos;
            this.basePosition[2] += deltaPos / 2;
        }
    }

    public mousedownListener(e: MouseEvent) {
        this.mouseDown = true;
    }

    public mousemoveListener(e: MouseEvent) {
        if (this.mouseDown) {
            if ((this.xRotation > -0.3 || e.movementY > 0) && (this.xRotation < 1 || e.movementY < 0)) {
                this.xRotation = (this.xRotation + e.movementY / this.cameraSpeed) % Math.PI;
            }
            this.zRotation += e.movementX / this.cameraSpeed;
            vec3.rotateX(this.up, [0, 0, 1], [0, 0, 1], this.xRotation);
        }
    }

    public mouseupListener(e: MouseEvent) {
        this.mouseDown = false;
    }

    public registerCallbacks(canvas: HTMLCanvasElement) {
        canvas.addEventListener("mousedown", (e) => { this.mousedownListener(e); });
        canvas.addEventListener("mousemove", (e) => { this.mousemoveListener(e); });
        canvas.addEventListener("wheel", (e) => { this.wheelListener(e); });
        window.addEventListener("mouseup", (e) => { this.mouseupListener(e); });
    }

    public getMatrix(): mat4 {
        const matrix = mat4.create();
        mat4.identity(matrix);
        mat4.lookAt(matrix, [0, 0, 0], this.basePosition, this.up);
        mat4.translate(matrix, matrix, this.basePosition);
        mat4.rotateX(matrix, matrix, this.xRotation);
        mat4.rotateZ(matrix, matrix, this.zRotation);
        mat4.translate(matrix, matrix, this.center);
        return matrix;
    }

    public setCenter(center: number[]) {
        this.center = vec3.fromValues(...center);
        vec3.scale(this.center, this.center, -1);
    }

    public getPosition(): vec3 {
        const matrix = mat4.create();
        mat4.identity(matrix);
        mat4.lookAt(matrix, [0, 0, 0], this.basePosition, this.up);
        mat4.rotateX(matrix, matrix, this.xRotation);
        mat4.rotateZ(matrix, matrix, this.zRotation);
        mat4.translate(matrix, matrix, this.center);
        const pos = vec3.create();
        return vec3.transformMat4(pos, this.basePosition, matrix);
    }
}
