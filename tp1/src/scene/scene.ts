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
import Water from "./objects/water";
import SceneObject from "./sceneObject";
import ShaderManager from "./shaderManager";

export default class Scene {
    private readonly glContext: GlContext;
    private readonly config: Config;
    private camera: Camera;
    public readonly catapultPosition = [12, 0, 0.25];
    private catapult: Catapult | undefined;

    private renderableList: SceneObject[] = new Array();

    constructor(gl: GlContext, camera: Camera, config: Config) {
        this.glContext = gl;
        this.camera = camera;
        this.config = config;
        this.buildRenderables();
        this.setupBaseProgram();
    }

    public rebuildScene() {
        this.renderableList.length = 0;
        this.buildRenderables();
        this.updateModel();
    }

    public updateModel() {
        this.catapult!.updateRockModel();

        const rootModelMatrix = mat4.create();
        mat4.identity(rootModelMatrix);

        for (const object of this.renderableList) {
            object.updateModelMatrix(rootModelMatrix);
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
        const baseProgram = ShaderManager.getProgram("base");
        const grassProgram = ShaderManager.getProgram("grass");

        const land = new Land(this.glContext, grassProgram);
        const landMatrix = mat4.create();
        mat4.fromScaling(landMatrix, [20, 20, 2]);
        mat4.translate(landMatrix, landMatrix, [0, 0, -0.25]);
        land.setBaseModelMatrix(landMatrix);
        this.renderableList.push(land);

        this.catapult = new Catapult(this.glContext, baseProgram);
        const catapultMatrix = mat4.create();
        mat4.fromTranslation(catapultMatrix, this.catapultPosition);
        mat4.scale(catapultMatrix, catapultMatrix, [0.2, 0.2, 0.2]);
        this.catapult.baseModelMatrix = catapultMatrix;
        this.renderableList.push(this.catapult);

        const castle = new Castle(this.glContext, baseProgram, this.config);
        this.renderableList.push(castle);

        const fortressWall = new FortressWall(this.glContext, baseProgram, this.config);
        this.renderableList.push(fortressWall);

        const water = new Water(this.glContext, baseProgram);
        const objMatrix = mat4.create();
        mat4.fromScaling(objMatrix, [12, 12, 1]);
        mat4.translate(objMatrix, objMatrix, [0, 0, -0.25]);
        water.baseModelMatrix = objMatrix;

        this.renderableList.push(water);
    }

    private setupBaseProgram() {
        const baseProgram = ShaderManager.getProgram("base");
        const gl = this.glContext.gl;
        baseProgram.onActivate = (glProgram: GlProgram) => {
            // Enable attributes
            const posVertexAttr = glProgram.getAttribLocation("a_position");
            gl.enableVertexAttribArray(posVertexAttr);
            const normalFragAttr = glProgram.getAttribLocation("aNormal");
            gl.enableVertexAttribArray(normalFragAttr);
            const textureUVFragAttr = glProgram.getAttribLocation("aTextureUV");
            gl.enableVertexAttribArray(textureUVFragAttr);

            // Set uniforms
            const cameraMatrixLoc = glProgram.getUniformLocation("cameraMatrix");
            const projMatrixLoc = glProgram.getUniformLocation("projMatrix");
            // Gray for non configured objects
            const baseColor = glProgram.getUniformLocation("modelColor");

            const cameraMatrix = this.camera.getMatrix();

            const projMatrix = mat4.create();
            mat4.identity(projMatrix);
            mat4.perspective(projMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

            gl.uniformMatrix4fv(cameraMatrixLoc, false, cameraMatrix);
            gl.uniformMatrix4fv(projMatrixLoc, false, projMatrix);
            gl.uniform4fv(baseColor, [0.7, 0.7, 0.7, 1]);
        };

        const grassProgram = ShaderManager.getProgram("grass");
        grassProgram.onActivate = baseProgram.onActivate;
    }
}
