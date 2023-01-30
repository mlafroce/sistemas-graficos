import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import TextureManager from "../textureManager";

export default class Fire extends CompositeObject {
    private clock: number = 0;

    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        const body = new Cube(glContext, glProgram, false);
        const bodyObj = new SceneObject(glContext, glProgram, body);
        body.texture = TextureManager.getTexture("fire");
        this.addChild(bodyObj);
    }

    public render() {
        this.glProgram.activate();
        const clockLoc = this.glProgram.getUniformLocation("clockTick");
        this.glContext.gl.uniform1f(clockLoc, this.clock);
        this.clock++;
        super.render();
    }
}
