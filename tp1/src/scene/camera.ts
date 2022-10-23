// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {Camera} from "./scene";

export class MouseCamera implements Camera {
    private angleX: number = 0;
    private angleY: number = 0;
    private distanceZ: number = 4;
    private mouseDown: boolean = false;
    private readonly cameraSpeed: number = 100;

    public wheelListener(e: WheelEvent) {
        this.distanceZ += e.deltaY / this.cameraSpeed;
    }

    public mousedownListener(e: MouseEvent) {
        this.angleX += (e.movementX / this.cameraSpeed);
        this.angleY += (e.movementY / this.cameraSpeed);
        this.mouseDown = true;
    }

    public mousemoveListener(e: MouseEvent) {
        if (this.mouseDown) {
            this.angleX += (e.movementX / this.cameraSpeed);
            this.angleY += (e.movementY / this.cameraSpeed);
        }
    }

    public mouseupListener(e: MouseEvent) {
        this.mouseDown = false;
    }

    public getMatrix(): mat4 {
        const matrix = mat4.create();
        mat4.identity(matrix);
        mat4.translate(matrix, matrix, [0, 0, -this.distanceZ]);
        mat4.rotate(matrix, matrix, this.angleX, [0, 1, 0]);
        mat4.rotate(matrix, matrix, this.angleY, [1, 0, 0]);
        mat4.rotate(matrix, matrix, 30 * Math.PI / 180, [1, 0, 0]);
        return matrix;
    }
}
