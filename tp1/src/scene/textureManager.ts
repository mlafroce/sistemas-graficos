import {GlContext} from "../gl";
import Texture from "./texture";

export default class TextureManager {
    private static textureMap: Map<string, Texture>;
    private static glContext: GlContext | undefined;

    private constructor() { }

    public static init(glContext: GlContext) {
        this.textureMap = new Map();
        this.glContext = glContext;
        //const texture = new Texture(glContext, "textures/stone-wall.png");
        const texture = new Texture(glContext, "textures/uv-test.png");
        this.textureMap.set("rock", texture);
    }

    public static getTexture(name: string): Texture {
        return this.textureMap.get(name)!;
    }
}
