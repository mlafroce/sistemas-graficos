import {GlContext, GlProgram} from "../gl";

export default interface Renderable {
    glContext: GlContext;
    glProgram: GlProgram;
    render(): void;
}
