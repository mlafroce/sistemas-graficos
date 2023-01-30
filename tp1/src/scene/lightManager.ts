// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {GlContext, GlProgram} from "../gl";
import {Config} from "../utils";

export class LightManager {
    private lightList: vec3[] = [];

    public registerLight(light: vec3) {
        this.lightList.push(...light);
    }

    public clear() {
        this.lightList.length = 0;
    }

    public setLightUniform(context: GlContext, glProgram: GlProgram, config: Config) {
        const lightLoc = glProgram.getUniformLocation("lightList");
        if (lightLoc) {
            context.gl.uniform3fv(lightLoc, this.lightList);
        }
        const ambientLightLoc = glProgram.getUniformLocation("ambientLightVec");
        if (ambientLightLoc) {
            const ambientLight = config.getAmbientLight();
            context.gl.uniform3f(ambientLightLoc, ambientLight[0], ambientLight[1], ambientLight[2]);
        }
    }
}
