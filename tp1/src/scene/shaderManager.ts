import {GlContext, GlProgram} from "../gl";

export default class ShaderManager {
    private static programMap: Map<string, GlProgram> = new Map();
    private static shaderMap: Map<string, WebGLShader> = new Map();

    private constructor() { }

    public static setShader(name: string, glShader: WebGLShader) {
        this.shaderMap.set(name, glShader);
    }

    public static initPrograms(context: GlContext) {
        this.programMap.set("base", context.createProgram(
            this.shaderMap.get("vertex-base")!,
            this.shaderMap.get("fragment-base")!,
        ));
        this.programMap.set("grass", context.createProgram(
            this.shaderMap.get("vertex-base")!,
            this.shaderMap.get("fragment-grass")!,
        ));
        this.programMap.set("water", context.createProgram(
            this.shaderMap.get("vertex-water")!,
            this.shaderMap.get("fragment-water")!,
        ));
        this.programMap.set("fire", context.createProgram(
            this.shaderMap.get("vertex-fire")!,
            this.shaderMap.get("fragment-fire")!,
        ));
        this.programMap.set("sky", context.createProgram(
            this.shaderMap.get("vertex-base")!,
            this.shaderMap.get("fragment-sky")!,
        ));
    }

    public static getProgram(name: string): GlProgram {
        return this.programMap.get(name)!;
    }
}
