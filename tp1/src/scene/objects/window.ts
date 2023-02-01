// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {CompositePath} from "../../curves/path";
import {GlContext, GlProgram} from "../../gl";
import Cube from "../../shapes/cube";
import RevolutionSurface from "../../shapes/revolutionSurface";
import {CompositeObject} from "../compositeObject";
import SceneObject from "../sceneObject";
import TextureManager from "../textureManager";
import ShaderManager from "../shaderManager";

export default class Window extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram) {
        super(glContext, glProgram);
        const topShape = CompositePath.fromPoints([[0.5, 1, 0], [0.5, 0.01, 0], [0.5, 0, 0], [0.49, 0, 0], [0, 0, 0]]);
        const top = new RevolutionSurface(glContext, glProgram, topShape, Math.PI, 10);
        top.build();
        const topObj = new SceneObject(glContext, glProgram, top);
        const mMatrix = mat4.create();
        mat4.fromTranslation(mMatrix, [0.5, 1, 0]);
        topObj.baseModelMatrix = mMatrix;
        this.addChild(topObj);
        const windowProgram = ShaderManager.getProgram("window");
        const window = new Cube(glContext, windowProgram);
        window.texture = TextureManager.getTexture("window");

        const windowObj = new SceneObject(glContext, glProgram, window);
        windowObj.setProgram(ShaderManager.getProgram("window"));
        windowObj.reflectionCoef = 5;
        this.addChild(windowObj);
    }

    public render() {
        super.render();
    }
}
