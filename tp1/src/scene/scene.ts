import {CubicBezier} from "../curves/bezier";
import Polygon from "../curves/polygon";
import {GlContext, GlProgram} from "../gl";
import Cube from "../shapes/cube";
import {Sphere} from "../shapes/surface";
import {SweepSurface} from "../shapes/sweepSurface";

// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {degToRad} from "../utils";
import {CompositeObject, Renderable} from "./renderable";

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
        const positionAttributeLocation = this.program.getAttribLocation("a_position");
        const modelMatrixLoc = this.program.getUniformLocation("modelMatrix");
        const cameraMatrixLoc = this.program.getUniformLocation("cameraMatrix")!;
        const projMatrixLoc = this.program.getUniformLocation("projMatrix")!;
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // draw
        const cameraMatrix = this.camera.getMatrix();

        const projMatrix = mat4.create();
        mat4.identity(projMatrix);
        mat4.perspective(projMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

        const modelMatrix = mat4.create();
        mat4.identity(modelMatrix);
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1, 0.5, 0.5));

        gl.uniformMatrix4fv(cameraMatrixLoc, false, cameraMatrix);
        gl.uniformMatrix4fv(projMatrixLoc, false, projMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);

        for (const renderable of this.renderableList) {
            renderable.render(positionAttributeLocation, modelMatrixLoc);
        }
    }

    private buildRenderables() {
        const curve = new CubicBezier([0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0], 20);
        const polygon = new Polygon(this.glContext);
        polygon.setVecPoints(curve.points);

        const cube = new Cube(this.glContext);
        const sphere = new Sphere(this.glContext, 1, 8, 8);
        sphere.build();
        const cat = new CompositeObject(this.glContext);

        const modelMatrix = mat4.create();
        mat4.identity(modelMatrix);
        mat4.rotate(modelMatrix, modelMatrix, degToRad(45), vec3.fromValues(1, 0, 0));
        cube.setBaseModelMatrix(modelMatrix);

        // @ts-ignore
        cat.addChild(sphere);
        // @ts-ignore
        cat.addChild(cube);
        // sphere.build();

        const myShape = [vec3.fromValues(0.1, 0.1, 0),
                        vec3.fromValues(0.2, 0.3, 0),
                        vec3.fromValues(0.3, 0.1, 0),
                        vec3.fromValues(0.2, 0.2, 0.1)];
        const sweepSurface = new SweepSurface(this.glContext, myShape, curve);
        sweepSurface.build();

        this.renderableList.push(polygon);
        this.renderableList.push(sweepSurface);
        this.renderableList.push(cat);
    }
}
