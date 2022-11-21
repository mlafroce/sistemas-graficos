// @ts-ignore
import * as mat2 from "gl-matrix/esm/mat2";
// @ts-ignore
import * as mat3 from "gl-matrix/esm/mat3";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {GlContext, GlProgram} from "../gl";
import Renderable from "./renderable";

export default class SceneObject implements Renderable {
    public baseColor: vec4 = vec4.fromValues(0.6, 0.6, 0.6, 1);
    public normalMatrix: mat3 = mat3.create();
    public modelMatrix: mat4 = mat4.create();
    public renderable: Renderable | undefined;
    public baseModelMatrix: mat4 = mat4.create();
    public textureMatrix: mat2 = mat2.create();

    constructor(public glContext: GlContext, public glProgram: GlProgram, renderable: Renderable | undefined) {
        this.renderable = renderable;
        mat2.identity(this.textureMatrix);
    }

    public updateModelMatrix(parentMatrix: mat4) {
        mat4.multiply(this.modelMatrix, parentMatrix, this.baseModelMatrix);
        mat3.normalFromMat4(this.normalMatrix, this.modelMatrix);
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
            const textureMatrixLoc = this.glProgram.getUniformLocation("textureMatrix");
            this.glContext.gl.uniformMatrix2fv(textureMatrixLoc, false, this.textureMatrix);
            this.renderable.render();
        }
    }
}
