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
        const ambientLightLoc = glProgram.getUniformLocation("ambientLightColor");
        if (ambientLightLoc) {
            const ambientLight = config.getAmbientLight();
            context.gl.uniform3f(ambientLightLoc, ambientLight[0], ambientLight[1], ambientLight[2]);
        }
        const sunLightLoc = glProgram.getUniformLocation("sunLightColor");
        if (sunLightLoc) {
            const sunLight = config.getSunLight();
            context.gl.uniform3f(sunLightLoc, sunLight[0], sunLight[1], sunLight[2]);
        }
        const torchLightLoc = glProgram.getUniformLocation("torchLightColor");
        if (torchLightLoc) {
            const torchLight = config.getTorchLight();
            context.gl.uniform3f(torchLightLoc, torchLight[0], torchLight[1], torchLight[2]);
        }
    }
}
