import {GlProgram} from "../gl";

export default class ShaderManager {
    private static textureMap: Map<string, GlProgram> = new Map();

    private constructor() { }

    public static setProgram(name: string, glProgram: GlProgram) {
        this.textureMap.set(name, glProgram);
    }

    public static getProgram(name: string): GlProgram {
        return this.textureMap.get(name)!;
    }
}
