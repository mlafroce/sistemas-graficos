// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../gl";
import {LightManager} from "./lightManager";
import SceneObject from "./sceneObject";

export class CompositeObject extends SceneObject {
    protected childList: SceneObject[] = new Array();

    constructor(public glContext: GlContext, public glProgram: GlProgram) {
        super(glContext, glProgram, undefined);
    }

    public addChild(child: SceneObject) {
        child.updateModelMatrix(this.modelMatrix);
        this.childList.push(child);
    }

    public setBaseModelMatrix(mMatrix: mat4) {
        this.baseModelMatrix = mMatrix;
    }

    public updateModelMatrix(parentMatrix: mat4) {
        mat4.multiply(this.modelMatrix, parentMatrix, this.baseModelMatrix);
        for (const child of this.childList) {
            child.updateModelMatrix(this.modelMatrix);
        }
    }

    public pushLights(lightManager: LightManager) {
        for (const child of this.childList) {
            child.pushLights(lightManager);
        }
    }

    public render(): void {
        for (const child of this.childList) {
            child.render();
        }
    }
}
