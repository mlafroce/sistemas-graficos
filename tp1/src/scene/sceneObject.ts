// @ts-ignore
import * as mat2 from "gl-matrix/esm/mat2";
// @ts-ignore
import * as mat3 from "gl-matrix/esm/mat3";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {GlContext, GlProgram} from "../gl";
import {Config} from "../utils";
import {LightManager} from "./lightManager";
import Renderable from "./renderable";

export default class SceneObject implements Renderable {
    public baseColor: vec4 = vec4.fromValues(0.6, 0.6, 0.6, 1);
    public shininess: number = 1;
    public reflectionCoef: number = 0.5;
    public normalMatrix: mat3 = mat3.create();
    public modelMatrix: mat4 = mat4.create();
    public renderable: Renderable | undefined;
    public baseModelMatrix: mat4 = mat4.create();
    public textureMatrix: mat2 = mat2.create();
    protected viewNormals: boolean = false;

    constructor(public glContext: GlContext, public glProgram: GlProgram, renderable: Renderable | undefined) {
        this.renderable = renderable;
        mat2.identity(this.textureMatrix);
    }

    public updateModelMatrix(parentMatrix: mat4) {
        mat4.multiply(this.modelMatrix, parentMatrix, this.baseModelMatrix);
        mat3.normalFromMat4(this.normalMatrix, this.modelMatrix);
    }

    public pushLights(lightManager: LightManager) {}

    public onConfigChanged(config: Config) {
    }

    public setProgram(glProgram: GlProgram) {
        this.glProgram = glProgram;
        this.glProgram.activate();
    }

    public render(): void {
        this.glProgram.activate();
        if (this.renderable) {
            const modelMatrixLoc = this.glProgram.getUniformLocation("modelMatrix");
            this.glContext.gl.uniformMatrix4fv(modelMatrixLoc, false, this.modelMatrix);
            const normalMatrixLoc = this.glProgram.getUniformLocation("normalMatrix");
            this.glContext.gl.uniformMatrix3fv(normalMatrixLoc, false, this.normalMatrix);
            const baseColorLoc = this.glProgram.getUniformLocation("modelColor");
            this.glContext.gl.uniform4fv(baseColorLoc, this.baseColor);
            const shininessLoc = this.glProgram.getUniformLocation("shininess");
            this.glContext.gl.uniform1f(shininessLoc, this.shininess);
            const reflectionCoefLoc = this.glProgram.getUniformLocation("reflectionCoef");
            this.glContext.gl.uniform1f(reflectionCoefLoc, this.reflectionCoef);
            const textureMatrixLoc = this.glProgram.getUniformLocation("textureMatrix");
            this.glContext.gl.uniformMatrix2fv(textureMatrixLoc, false, this.textureMatrix);
            const viewNormalsLoc = this.glProgram.getUniformLocation("viewNormals");
            this.glContext.gl.uniform1i(viewNormalsLoc, Config.globalViewNormals ? 1 : 0);
            this.renderable.render();
        }
    }
}
