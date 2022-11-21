import {CubicBezier} from "../curves/bezier";
import Polygon from "../curves/polygon";
import {GlContext, GlProgram} from "../gl";

// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {Config} from "../utils";
import {Camera} from "./camera/firstPersonCamera";
import Castle from "./objects/castle";
import Catapult from "./objects/catapult";
import FortressWall from "./objects/fortressWall";
import Land from "./objects/land";
import SceneObject from "./sceneObject";

export default class Scene {
    private readonly glContext: GlContext;
    private readonly program: GlProgram;
    private readonly config: Config;
    private camera: Camera;
    public readonly catapultPosition = [12, 0, 0.25];
    private catapult: Catapult | undefined;

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
        const textureUVFragAttr = this.program.getAttribLocation("aTextureUV");
        gl.enableVertexAttribArray(textureUVFragAttr);

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
        gl.uniform4fv(baseColor, [0.7, 0.7, 0.7, 1]);

        this.catapult!.updateRockModel();

        for (const object of this.renderableList) {
            object.updateModelMatrix(modelMatrix);
        }
    }

    public render() {
        for (const renderable of this.renderableList) {
            renderable.render();
        }
    }

    public setCamera(camera: Camera) {
        this.camera = camera;
    }

    public keypressListener(e: KeyboardEvent) {
        if (e.key === " ") {
            this.catapult!.launch();
        }
    }

    private buildRenderables() {
        const land = new Land(this.glContext, this.program);
        const landMatrix = mat4.create();
        mat4.fromScaling(landMatrix, [20, 20, 2]);
        mat4.translate(landMatrix, landMatrix, [0, 0, -0.25]);
        land.setBaseModelMatrix(landMatrix);
        this.renderableList.push(land);

        this.catapult = new Catapult(this.glContext, this.program);
        const catapultMatrix = mat4.create();
        mat4.fromTranslation(catapultMatrix, this.catapultPosition);
        mat4.scale(catapultMatrix, catapultMatrix, [0.2, 0.2, 0.2]);
        this.catapult.baseModelMatrix = catapultMatrix;
        this.renderableList.push(this.catapult);

        const castle = new Castle(this.glContext, this.program, this.config);
        this.renderableList.push(castle);

        const fortressWall = new FortressWall(this.glContext, this.program, this.config);
        this.renderableList.push(fortressWall);
    }
}
