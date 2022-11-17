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

    constructor(public glContext: GlContext, public glProgram: GlProgram, renderable: Renderable | undefined) {
        this.renderable = renderable;
    }

    public updateModelMatrix(parentMatrix: mat4) {
        mat4.multiply(this.modelMatrix, parentMatrix, this.baseModelMatrix);
        mat3.normalFromMat4(this.normalMatrix, this.modelMatrix);
        //mat3.invert(this.normalMatrix, this.normalMatrix);
        //mat4.transpose(this.normalMatrix, this.normalMatrix);
    }

    public render(): void {
        if (this.renderable) {
            const modelMatrixLoc = this.glProgram.getUniformLocation("modelMatrix");
            this.glContext.gl.uniformMatrix4fv(modelMatrixLoc, false, this.modelMatrix);
            const normalMatrixLoc = this.glProgram.getUniformLocation("normalMatrix");
            this.glContext.gl.uniformMatrix3fv(normalMatrixLoc, false, this.normalMatrix);
            const baseColor = this.glProgram.getUniformLocation("modelColor");
            this.glContext.gl.uniform4fv(baseColor, this.baseColor);
            this.renderable.render();
        }
    }
}
