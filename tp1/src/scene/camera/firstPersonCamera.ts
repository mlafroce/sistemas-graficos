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

export class FirstPersonCamera implements Camera {
    private cursorX: number = 0;
    private cursorY: number = 0;
    private angleX: number = 0;
    private angleY: number = 0;
    private position: vec3;
    private mouseDown: boolean = false;
    private readonly cameraSpeed: number = 100;
    private readonly touchSpeed: number = this.cameraSpeed * 5;
    private readonly keyboardSpeed: number = 0.2;

    constructor() {
        //this.angle[1] = -30 * Math.PI / 180;
        this.angleX = Math.PI / 2;
        this.position = vec3.create();
        this.position[1] = -5;
        this.position[2] = 2;
    }

    public wheelListener(e: WheelEvent) {
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

    public touchstartListener(e: TouchEvent) {
        this.cursorX = e.touches[0].pageX;
        this.cursorY = e.touches[0].pageY;
    }

    public touchmoveListener(e: TouchEvent) {
        const offsetX = this.cursorX - e.touches[0].pageX;
        const offsetY = this.cursorY - e.touches[0].pageY;
        this.angleX += (offsetX / this.touchSpeed);
        this.angleY += (offsetY / this.touchSpeed);
        this.touchstartListener(e);
    }

    public keypressListener(e: KeyboardEvent) {
        const delta = vec3.create();
        switch (e.key) {
            case "w":
                delta[1] = -this.keyboardSpeed;
                break;
            case "a":
                delta[0] = -this.keyboardSpeed;
                break;
            case "s":
                delta[1] = this.keyboardSpeed;
                break;
            case "d":
                delta[0] = this.keyboardSpeed;
                break;
            default:
                return;
        }
        vec3.add(this.position, this.position, delta);
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
        const angleDelta = [
            Math.cos(this.angleX) * Math.cos(this.angleY),
            Math.sin(this.angleX) * Math.cos(this.angleY),
            Math.sin(this.angleY)];
        const eyeTarget = vec3.create();
        vec3.add(eyeTarget, this.position, angleDelta);
        const matrix = mat4.create();
        mat4.identity(matrix);
        mat4.lookAt(matrix, this.position, eyeTarget, [0, 0, 1]);
        return matrix;
    }

    // tslint:disable-next-line:no-empty
    public update() {}
}
