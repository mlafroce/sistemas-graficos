import {GlContext} from "../gl";
import Texture from "./texture";

export default class TextureManager {
    private static textureMap: Map<string, Texture>;
    private static glContext: GlContext | undefined;

    private constructor() { }

    public static init(glContext: GlContext) {
        this.textureMap = new Map();
        this.glContext = glContext;
        this.textureMap.set("rock", new Texture(glContext, "textures/stone-wall.png"));
        this.textureMap.set("rock-02", new Texture(glContext, "textures/stone-wall-02.png"));
        this.textureMap.set("grass01", new Texture(glContext, "textures/grass-01.png"));
        this.textureMap.set("soil", new Texture(glContext, "textures/soil.png"));
        this.textureMap.set("uvTest", new Texture(glContext, "textures/uv-test.png"));
    }

    public static getTexture(name: string): Texture {
        return this.textureMap.get(name)!;
    }
}
