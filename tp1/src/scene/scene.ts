import {CubicBezier} from "../curves/bezier";
import Polygon from "../curves/polygon";
import {GlContext, GlProgram} from "../gl";
import Square from "../shapes/cube";
import {Sphere} from "../shapes/surface";
import {SweepSurface} from "../shapes/sweepSurface";
import {MouseCamera} from "./camera";

// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";

export interface Renderable {
    render(positionAttributeLocation: number): void ;
}

export interface Camera {
    getMatrix(): mat4;
}

export default class Scene {
    private readonly glContext: GlContext;
    private readonly program: GlProgram;
    private readonly camera: Camera;

    private renderableList: Renderable[] = new Array();

    constructor(gl: GlContext, program: GlProgram, camera: Camera) {
        this.glContext = gl;
        this.program = program;
        this.camera = camera;
        this.buildRenderables();
    }

    public render() {
        const gl = this.glContext.gl;
        const positionAttributeLocation = gl.getAttribLocation(this.program.program, "a_position");
        const cameraMatrixLoc = this.program.getUniformLocation("cameraMatrix")!;
        const projMatrixLoc = this.program.getUniformLocation("projMatrix")!;
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // draw
        const cameraMatrix = this.camera.getMatrix();

        const projMatrix = mat4.create();
        mat4.identity(projMatrix);
        mat4.perspective(projMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

        gl.uniformMatrix4fv(cameraMatrixLoc, false, cameraMatrix);
        gl.uniformMatrix4fv(projMatrixLoc, false, projMatrix);

        for (const renderable of this.renderableList) {
            renderable.render(positionAttributeLocation);
        }
    }

    private buildRenderables() {
        const gl = this.glContext.gl;
        const curve = new CubicBezier([0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0], 20);
        const polygon = new Polygon(gl);
        polygon.setVecPoints(curve.points);

        const square = new Square(gl);
        const sphere = new Sphere(gl, 1, 8, 8);
        // sphere.build();

        const myShape = [vec3.fromValues(0.1, 0.1, 0),
                        vec3.fromValues(0.2, 0.3, 0),
                        vec3.fromValues(0.3, 0.1, 0),
                        vec3.fromValues(0.2, 0.2, 0.1)];
        const sweepSurface = new SweepSurface(gl, myShape, curve);
        sweepSurface.build();

        this.renderableList.push(polygon);
        this.renderableList.push(sweepSurface);
    }
}
