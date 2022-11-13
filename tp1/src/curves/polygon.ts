// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlBuffer, GlContext, GlProgram} from "../gl";
import Renderable from "../scene/renderable";

export default class Polygon implements Renderable {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer

    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;
    private pointsBuffer: GlBuffer;
    private pointsSize: number = 0;

    constructor(glContext: GlContext, glProgram: GlProgram) {
        this.glContext = glContext;
        this.glProgram = glProgram;
        this.pointsBuffer = new GlBuffer(this.glContext.gl);
        this.type = this.glContext.gl.FLOAT;
    }

    public setVecPoints(positions: Float32Array[]) {
        this.setPoints(positions.map((p) => Array.from(p)).flat());
    }

    public setPoints(positions: number[]) {
        this.pointsBuffer.bufferData(new Float32Array(positions), this.glContext.gl.STATIC_DRAW);
        this.pointsSize = positions.length / this.size;
    }

    public render() {
        const gl = this.glContext.gl;
        this.pointsBuffer.bindBuffer();
        const positionAttributeLocation = this.glProgram.getAttribLocation("a_position");
        gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);
        gl.drawArrays(gl.LINE_STRIP, 0, this.pointsSize);
    }
}
