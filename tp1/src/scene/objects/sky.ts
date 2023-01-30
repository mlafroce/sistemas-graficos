// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {GlContext, GlProgram} from "../../gl";
import Sphere from "../../shapes/sphere";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import TextureManager from "../textureManager";

export default class Sky extends CompositeObject {
    private sphereObj: SceneObject;

    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        const sphere = new Sphere(glContext, glProgram, 10, 10, 10);
        sphere.build();
        this.sphereObj = new SceneObject(glContext, glProgram, sphere);
        sphere.textureList.push(TextureManager.getTexture("sky"));

        const matrix = mat4.create();
        mat4.fromScaling(matrix, [6, 6, 6]);
        this.onConfigChanged(config);
        this.addChild(this.sphereObj);
    }

    public onConfigChanged(config: Config) {
        const matrix = mat4.create();
        mat4.fromScaling(matrix, [6, 6, 6]);
        mat4.rotateZ(matrix, matrix, Math.PI * config.sunTheta / 180);
        mat4.rotateX(matrix, matrix, - Math.PI * config.sunPhi / 180);

        const sunPos = vec3.fromValues(0, 0, 100);
        vec3.transformMat4(sunPos, sunPos, matrix);

        // TODO don't use config as sunlight pos storage
        config.sunPos = sunPos;
        this.sphereObj.baseModelMatrix = matrix;
    }
}
