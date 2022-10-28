// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext} from "../gl";

export interface Renderable {
    glContext: GlContext;
    render(positionAttributeLocation: number, matrixUniformLocation: WebGLUniformLocation | null): void;
}

export class CompositeObject implements Renderable {
    public baseModelMatrix: mat4 = mat4.create();
    public modelMatrix: mat4 = mat4.create();
    protected childList: Renderable[] = new Array();

    constructor(public glContext: GlContext) { }

    public addChild(child: CompositeObject) {
        // @ts-ignore
        if (child.updateModelMatrix) {
            // @ts-ignore
            child.updateModelMatrix(this.modelMatrix);
        } else {
            console.warn("Child has no matrix");
        }
        this.childList.push(child);
    }

    public setBaseModelMatrix(mMatrix: mat4) {
        this.baseModelMatrix = mMatrix;
    }

    protected updateModelMatrix(parentMatrix: mat4) {
        mat4.multiply(this.modelMatrix, this.baseModelMatrix, parentMatrix);
        for (const child of this.childList) {
            // @ts-ignore
            if (child.updateModelMatrix) {
                // @ts-ignore
                child.updateModelMatrix(this.modelMatrix);
            } else {
                console.warn("Child has no matrix");
            }
        }
    }

    public render(positionAttributeLocation: number, modelMatrixLoc: WebGLUniformLocation | null): void {
        for (const child of this.childList) {
            this.glContext.gl.uniformMatrix4fv(modelMatrixLoc, false, this.modelMatrix);
            child.render(positionAttributeLocation, modelMatrixLoc);
        }
    }
}
