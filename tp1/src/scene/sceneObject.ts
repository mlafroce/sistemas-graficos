// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../gl";
import Renderable from "./renderable";

export default class SceneObject implements Renderable {
    public modelMatrix: mat4 = mat4.create();
    public baseModelMatrix: mat4 = mat4.create();
    public renderable: Renderable | undefined;

    constructor(public glContext: GlContext, public glProgram: GlProgram, renderable: Renderable | undefined) {
        this.renderable = renderable;
    }

    public updateModelMatrix(parentMatrix: mat4) {
        mat4.multiply(this.modelMatrix, parentMatrix, this.baseModelMatrix);
    }

    public render(): void {
        if (this.renderable) {
            const modelMatrixLoc = this.glProgram.getUniformLocation("modelMatrix");
            this.glContext.gl.uniformMatrix4fv(modelMatrixLoc, false, this.modelMatrix);
            this.renderable.render();
        }
    }
}
