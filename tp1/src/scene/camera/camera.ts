// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";

export interface Camera {
    getMatrix(): mat4;
    update(): mat4;
}

export class MouseCamera implements Camera {
    private cursorX: number = 0;
    private cursorY: number = 0;
    private angle: vec3;
    private position: vec3;
    private mouseDown: boolean = false;
    private readonly cameraSpeed: number = 100;
    private readonly touchSpeed: number = this.cameraSpeed * 5;
    private readonly keyboardSpeed: number = 0.2;

    constructor() {
        this.angle = vec3.create();
        this.angle[1] = -30 * Math.PI / 180;
        this.position = vec3.create();
        this.position[1] = 10;
        this.position[2] = -10;
    }

    public wheelListener(e: WheelEvent) {
        const deltaPos = vec4.fromValues(0, e.deltaY / this.cameraSpeed, 0, 0);
        const cameraMatrix = this.getMatrix();

        vec4.transformMat4(deltaPos, deltaPos, cameraMatrix);
        vec4.add(this.position, this.position, deltaPos);
    }

    public mousedownListener(e: MouseEvent) {
        this.angle[0] += (e.movementX / this.cameraSpeed);
        this.angle[1] += (e.movementY / this.cameraSpeed);
        this.mouseDown = true;
    }

    public mousemoveListener(e: MouseEvent) {
        if (this.mouseDown) {
            this.angle[0] += (e.movementX / this.cameraSpeed);
            this.angle[1] += (e.movementY / this.cameraSpeed);
        }
    }

    public mouseupListener(e: MouseEvent) {
        this.mouseDown = false;
    }

    public touchstartListener(e: TouchEvent) {
        this.cursorX = e.touches[0].pageX;
        this.cursorY = e.touches[0].pageY;
    }

    public touchmoveListener(e: TouchEvent) {
        const offsetX = this.cursorX - e.touches[0].pageX;
        const offsetY = this.cursorY - e.touches[0].pageY;
        this.angle[0] += (offsetX / this.touchSpeed);
        this.angle[1] += (offsetY / this.touchSpeed);
        this.touchstartListener(e);
    }

    public keypressListener(e: KeyboardEvent) {
        switch (e.key) {
            case "w":
                this.position[2] -= this.keyboardSpeed;
                break;
            case "a":
                this.position[0] += this.keyboardSpeed;
                break;
            case "s":
                this.position[2] += this.keyboardSpeed;
                break;
            case "d":
                this.position[0] -= this.keyboardSpeed;
                break;
        }
    }

    public registerCallbacks(canvas: HTMLCanvasElement) {
        canvas.addEventListener("mousedown", (e) => { this.mousedownListener(e); });
        canvas.addEventListener("mousemove", (e) => { this.mousemoveListener(e); });
        canvas.addEventListener("wheel", (e) => { this.wheelListener(e); });
        canvas.addEventListener("touchstart", (e) => { this.touchstartListener(e); });
        canvas.addEventListener("touchmove", (e) => { this.touchmoveListener(e); });
        window.addEventListener("mouseup", (e) => { this.mouseupListener(e); });
        window.addEventListener("keydown", (e) => { this.keypressListener(e); });
    }

    public getMatrix(): mat4 {
        const matrix = mat4.create();
        mat4.identity(matrix);
        mat4.rotateZ(matrix, matrix, this.angle[2]);
        mat4.rotateY(matrix, matrix, this.angle[0]);
        mat4.rotateX(matrix, matrix, this.angle[1]);
        mat4.translate(matrix, matrix, this.position);
        return matrix;
    }

    // tslint:disable-next-line:no-empty
    public update() {}
}
