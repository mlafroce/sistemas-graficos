import {CompositePath} from "../curves/path";
import {GlContext, GlProgram} from "../gl";
import Renderable from "../scene/renderable";
import RevolutionSurface from "./revolutionSurface";

export default class Cylinder implements Renderable {
    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;
    private surface: RevolutionSurface;

    constructor(glContext: GlContext, glProgram: GlProgram, circlePoints: number) {
        this.glContext = glContext;
        this.glProgram = glProgram;
        const shape = CompositePath.fromPoints([
            [0, 1, 0], [0.99, 1, 0], [1, 1, 0], [1, 0.01, 0],
            [1, 0, 0], [0.99, 0, 0], [0, 0, 0]]);
        this.surface = new RevolutionSurface(glContext, glProgram, shape, Math.PI * 2, circlePoints);
        this.surface.build();
    }

    public render() {
        this.surface.render();
    }
}
