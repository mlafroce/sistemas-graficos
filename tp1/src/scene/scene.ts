import {CubicBezier} from "../curves/bezier";
import Polygon from "../curves/polygon";
import {GlContext, GlProgram} from "../gl";
import Cylinder from "../shapes/cylinder";
import Cube from "../shapes/cube";
import {Sphere} from "../shapes/surface";
import {SweepSurface} from "../shapes/sweepSurface";

// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {degToRad} from "../utils";
import {CompositeObject} from "./compositeObject";
import Renderable from "./renderable";
import SceneObject from "./sceneObject";

export interface Camera {
    getMatrix(): mat4;
}

export default class Scene {
    private readonly glContext: GlContext;
    private readonly program: GlProgram;
    private readonly camera: Camera;

    private renderableList: SceneObject[] = new Array();

    constructor(gl: GlContext, program: GlProgram, camera: Camera) {
        this.glContext = gl;
        this.program = program;
        this.camera = camera;
        this.buildRenderables();
    }

    public updateModel() {
        const gl = this.glContext.gl;
        const positionAttributeLocation = this.program.getAttribLocation("a_position");
        const modelMatrixLoc = this.program.getUniformLocation("modelMatrix");
        const cameraMatrixLoc = this.program.getUniformLocation("cameraMatrix")!;
        const projMatrixLoc = this.program.getUniformLocation("projMatrix")!;
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        const cameraMatrix = this.camera.getMatrix();

        const projMatrix = mat4.create();
        mat4.identity(projMatrix);
        mat4.perspective(projMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

        const modelMatrix = mat4.create();
        mat4.identity(modelMatrix);

        gl.uniformMatrix4fv(cameraMatrixLoc, false, cameraMatrix);
        gl.uniformMatrix4fv(projMatrixLoc, false, projMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);

        for (const object of this.renderableList) {
            object.updateModelMatrix(modelMatrix);
        }
    }

    public render() {
        for (const renderable of this.renderableList) {
            renderable.render();
        }
    }

    private buildRenderables() {
        const curve = new CubicBezier([0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0], 20);
        const polygon = new Polygon(this.glContext, this.program);
        polygon.setVecPoints(curve.points);

        const wheels = new CompositeObject(this.glContext, this.program);
        for (let i = 0; i < 4; ++i) {
            const cylinder = new Cylinder(this.glContext, this.program, 10);
            const cylinderObj = new SceneObject(this.glContext, this.program, cylinder);

            const cylinderMatrix = mat4.create();
            const axis = Math.floor(i / 2);
            const distance = 4;
            mat4.fromTranslation(cylinderMatrix, [axis * distance, 0, i % 2 * distance]);
            cylinderObj.baseModelMatrix = cylinderMatrix;
            wheels.addChild(cylinderObj);
        }
        const wheelsMatrix = mat4.create();
        mat4.fromScaling(wheelsMatrix, [0.2, 0.2, 0.2]);
        wheels.setBaseModelMatrix(wheelsMatrix);

        const catapultBase = new Cube(this.glContext, this.program);
        const catapultBaseObj = new SceneObject(this.glContext, this.program, catapultBase);

        const catapultBaseMatrix = mat4.create();
        mat4.fromScaling(catapultBaseMatrix, [2, 0.2, 0.8]);
        mat4.translate(catapultBaseMatrix, catapultBaseMatrix, [-0.3, -0.2, 0.1]);
        catapultBaseObj.baseModelMatrix = catapultBaseMatrix;

        const catapult = new CompositeObject(this.glContext, this.program);
        catapult.addChild(wheels);
        catapult.addChild(catapultBaseObj);
        this.renderableList.push(catapult);
    }
}
