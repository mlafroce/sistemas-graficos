import {GlContext} from "../gl";
import Texture from "./texture";

export default class TextureManager {
    private static textureMap: Map<string, Texture>;
    private static glContext: GlContext | undefined;

    private constructor() { }

    public static init(glContext: GlContext) {
        this.textureMap = new Map();
        this.glContext = glContext;
        this.textureMap.set("rock", new Texture(glContext, "textures/rock.png"));
        this.textureMap.set("stone", new Texture(glContext, "textures/stone-wall.png"));
        this.textureMap.set("stone-02", new Texture(glContext, "textures/stone-wall-02.png"));
        this.textureMap.set("grass01", new Texture(glContext, "textures/grass-01.png"));
        this.textureMap.set("soil", new Texture(glContext, "textures/soil.png"));
        this.textureMap.set("uvTest", new Texture(glContext, "textures/uv-test.png"));
        this.textureMap.set("wood", new Texture(glContext, "textures/wood-01.png"));
        this.textureMap.set("fire", new Texture(glContext, "textures/fire.png"));
        this.textureMap.set("blue-tile", new Texture(glContext, "textures/blue-tile.png"));
        this.textureMap.set("sky", new Texture(glContext, "textures/sky.png"));
        this.textureMap.set("wheel", new Texture(glContext, "textures/wheel.png"));
        this.textureMap.set("yellow-stone", new Texture(glContext, "textures/yellow-stone.png"));
    }

    public static getTexture(name: string): Texture {
        return this.textureMap.get(name)!;
    }
}
