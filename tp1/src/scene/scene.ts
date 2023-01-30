import {GlContext, GlProgram} from "../gl";

// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {Config} from "../utils";
import {Camera} from "./camera/firstPersonCamera";
import {LightManager} from "./lightManager";
import Castle from "./objects/castle";
import Catapult from "./objects/catapult";
import FortressWall from "./objects/fortressWall";
import Land from "./objects/land";
import Water from "./objects/water";
import SceneObject from "./sceneObject";
import ShaderManager from "./shaderManager";
import Sky from "./objects/sky";


export default class Scene {
    private readonly glContext: GlContext;
    private readonly config: Config;
    private camera: Camera;
    public readonly catapultPosition = [12, 0, 0.2];
    private catapult: Catapult | undefined;
    private land: Land | undefined;
    private castle: Castle | undefined;
    private fortressWall: FortressWall | undefined;
    private water: Water | undefined;
    private sky: Sky | undefined;
    private lightManager: LightManager = new LightManager();

    private renderableList: SceneObject[] = new Array();

    constructor(gl: GlContext, camera: Camera, config: Config) {
        this.glContext = gl;
        this.camera = camera;
        this.config = config;
        this.buildRenderables();
        this.setupBaseProgram();
    }

    public onConfigChanged() {
        for (const object of this.renderableList) {
            object.onConfigChanged(this.config);
        }
        this.updateCatapultPosition();
        this.updateModel();
    }

    public onShaderConfigChanged() {
        // TODO: change shaders instead of using boolean
        /*
        if (this.config.viewNormals) {
            const normalsProgram = ShaderManager.getProgram("normals");
            this.land!.setProgram(normalsProgram);
            this.catapult!.setProgram(normalsProgram);
            this.castle!.setProgram(normalsProgram);
            this.fortressWall!.setProgram(normalsProgram);
            this.water!.setProgram(normalsProgram);
        } else {
            const baseProgram = ShaderManager.getProgram("base");
            const grassProgram = ShaderManager.getProgram("grass");
            this.land!.setProgram(grassProgram);
            this.catapult!.setProgram(baseProgram);
            this.castle!.setProgram(baseProgram);
            this.fortressWall!.setProgram(baseProgram);
            this.water!.setProgram(baseProgram);
        }
         */
        Config.globalViewNormals = this.config.viewNormals; // FIXME!!
    }

    public updateModel() {
        this.catapult!.updateRockModel();

        const rootModelMatrix = mat4.create();
        mat4.identity(rootModelMatrix);

        this.lightManager.clear();
        for (const object of this.renderableList) {
            object.updateModelMatrix(rootModelMatrix);
            object.pushLights(this.lightManager);
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
        const waterProgram = ShaderManager.getProgram("water");
        const skyProgram = ShaderManager.getProgram("sky");

        this.land = new Land(this.glContext, grassProgram);
        const landMatrix = mat4.create();
        mat4.fromScaling(landMatrix, [20, 20, 2]);
        mat4.translate(landMatrix, landMatrix, [0, 0, -0.25]);
        this.land.setBaseModelMatrix(landMatrix);
        this.renderableList.push(this.land);

        this.catapult = new Catapult(this.glContext, baseProgram, this.config);
        this.updateCatapultPosition();
        this.renderableList.push(this.catapult);

        this.castle = new Castle(this.glContext, baseProgram, this.config);
        this.renderableList.push(this.castle);

        this.fortressWall = new FortressWall(this.glContext, baseProgram, this.config);
        this.renderableList.push(this.fortressWall);

        this.water = new Water(this.glContext, waterProgram);
        const objMatrix = mat4.create();
        mat4.fromScaling(objMatrix, [12, 12, 1]);
        mat4.translate(objMatrix, objMatrix, [0, 0, -0.25]);
        this.water.baseModelMatrix = objMatrix;
        this.renderableList.push(this.water);

        this.sky = new Sky(this.glContext, skyProgram, this.config);
        this.renderableList.push(this.sky);
    }

    private setupBaseProgram() {
        const baseProgram = ShaderManager.getProgram("base");
        const gl = this.glContext.gl;
        baseProgram.onActivate = (glProgram: GlProgram) => {
            // Enable attributes
            const posVertexAttr = glProgram.getAttribLocation("aPosition");
            gl.enableVertexAttribArray(posVertexAttr);
            const normalFragAttr = glProgram.getAttribLocation("aNormal");
            if (normalFragAttr >= 0) {
                gl.enableVertexAttribArray(normalFragAttr);
            }
            const textureUVFragAttr = glProgram.getAttribLocation("aTextureUV");
            if (textureUVFragAttr >= 0) {
                gl.enableVertexAttribArray(textureUVFragAttr);
            }

            // Set uniforms
            const cameraMatrixLoc = glProgram.getUniformLocation("cameraMatrix");
            const eyePosLoc = glProgram.getUniformLocation("eyePos");
            const projMatrixLoc = glProgram.getUniformLocation("projMatrix");
            this.lightManager.setLightUniform(this.glContext, glProgram, this.config);
            // Gray for non configured objects
            const baseColor = glProgram.getUniformLocation("modelColor");

            const cameraMatrix = this.camera.getMatrix();
            const eyePos = this.camera.getPosition();
            const projMatrix = mat4.create();
            mat4.identity(projMatrix);
            mat4.perspective(projMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

            const sunLightLoc = glProgram.getUniformLocation("sunLightPos");
            const sunPos = this.config.sunPos;
            // @ts-ignore
            this.glContext.gl.uniform3f(sunLightLoc, sunPos[0], sunPos[1], sunPos[2]);

            gl.uniformMatrix4fv(cameraMatrixLoc, false, cameraMatrix);
            gl.uniformMatrix4fv(projMatrixLoc, false, projMatrix);
            gl.uniform4f(baseColor, 0.7, 0.7, 0.7, 1);
            gl.uniform3f(eyePosLoc, eyePos[0], eyePos[1], eyePos[2]);
        };

        const grassProgram = ShaderManager.getProgram("grass");
        grassProgram.onActivate = (glProgram: GlProgram) => {
            baseProgram.onActivate(glProgram);
            const grassSampler = glProgram.getUniformLocation("grassSampler");
            gl.uniform1i(grassSampler, 0);
            const soilSampler = glProgram.getUniformLocation("soilSampler");
            gl.uniform1i(soilSampler, 1);
            const noiseSampler = glProgram.getUniformLocation("noiseSampler");
            gl.uniform1i(noiseSampler, 2);
        };

        const waterProgram = ShaderManager.getProgram("water");
        waterProgram.onActivate = (glProgram: GlProgram) => {
            baseProgram.onActivate(glProgram);
            const noise1Sampler = glProgram.getUniformLocation("noise1Sampler");
            gl.uniform1i(noise1Sampler, 0);
            const noise2Sampler = glProgram.getUniformLocation("noise2Sampler");
            gl.uniform1i(noise2Sampler, 1);
        };

        const fireProgram = ShaderManager.getProgram("fire");
        fireProgram.onActivate = (glProgram: GlProgram) => {
            baseProgram.onActivate(glProgram);
            // Set uniforms
            const fireSampler = glProgram.getUniformLocation("fireSampler");
            gl.uniform1i(fireSampler, 0);
        };

        const skyProgram = ShaderManager.getProgram("sky");
        skyProgram.onActivate = (glProgram: GlProgram) => {
            baseProgram.onActivate(glProgram);
        }
    }

    // FIXME
    private updateCatapultPosition() {
        const mMatrix = mat4.create();
        mat4.fromTranslation(mMatrix, this.catapultPosition);
        mat4.scale(mMatrix, mMatrix, [0.1, 0.1, 0.1]);
        mat4.rotateZ(mMatrix, mMatrix, Math.PI * this.config.catapultAngle / 180);
        mat4.translate(mMatrix, mMatrix, [-5, -2, 0]);
        this.catapult!.baseModelMatrix = mMatrix;
    }
}
