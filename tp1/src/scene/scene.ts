import {CubicBezier} from "../curves/bezier";
import Polygon from "../curves/polygon";
import {GlContext, GlProgram} from "../gl";

// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {Config} from "../utils";
import {Camera} from "./camera";
import Castle from "./objects/castle";
import Catapult from "./objects/catapult";
import FortressWall from "./objects/fortressWall";
import SceneObject from "./sceneObject";

export default class Scene {
    private readonly glContext: GlContext;
    private readonly program: GlProgram;
    private readonly camera: Camera;
    private readonly config: Config;

    private renderableList: SceneObject[] = new Array();

    constructor(gl: GlContext, program: GlProgram, camera: Camera, config: Config) {
        this.glContext = gl;
        this.program = program;
        this.camera = camera;
        this.config = config;
        this.buildRenderables();
    }

    public rebuildScene() {
        this.renderableList.length = 0;
        this.buildRenderables();
        this.updateModel();
    }

    public updateModel() {
        const gl = this.glContext.gl;

        // Enable attributes
        const posVertexAttr = this.program.getAttribLocation("a_position");
        gl.enableVertexAttribArray(posVertexAttr);
        const normalFragAttr = this.program.getAttribLocation("aNormal");
        gl.enableVertexAttribArray(normalFragAttr);

        const cameraMatrix = this.camera.getMatrix();

        const projMatrix = mat4.create();
        mat4.identity(projMatrix);
        mat4.perspective(projMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

        const modelMatrix = mat4.create();
        mat4.identity(modelMatrix);

        // Set uniforms
        const modelMatrixLoc = this.program.getUniformLocation("modelMatrix");
        const cameraMatrixLoc = this.program.getUniformLocation("cameraMatrix");
        const projMatrixLoc = this.program.getUniformLocation("projMatrix");
        // Gray for non configured objects
        const baseColor = this.program.getUniformLocation("modelColor");

        gl.uniformMatrix4fv(cameraMatrixLoc, false, cameraMatrix);
        gl.uniformMatrix4fv(projMatrixLoc, false, projMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
        gl.uniform4fv(baseColor, [0.6, 0.6, 0.6, 1]);

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

        const catapult = new Catapult(this.glContext, this.program);
        const catapultMatrix = mat4.create();
        mat4.fromTranslation(catapultMatrix, [10, 0, 0]);
        mat4.scale(catapultMatrix, catapultMatrix, [0.2, 0.2, 0.2]);
        catapult.baseModelMatrix = catapultMatrix;
        this.renderableList.push(catapult);

        const castle = new Castle(this.glContext, this.program, this.config);
        this.renderableList.push(castle);

        const wallTower = new FortressWall(this.glContext, this.program, this.config);
        this.renderableList.push(wallTower);
    }
}
