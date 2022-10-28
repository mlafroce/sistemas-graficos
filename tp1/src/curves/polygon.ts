// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlBuffer, GlContext} from "../gl";

export default class Polygon {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer

    public glContext: GlContext;
    private buffer: GlBuffer;
    private bufferSize: number = 0;
    public baseModelMatrix: mat4 = mat4.create();
    public modelMatrix: mat4 = mat4.create();

    constructor(glContext: GlContext) {
        this.glContext = glContext;
        this.buffer = new GlBuffer(this.glContext.gl);
        this.type = this.glContext.gl.FLOAT;
    }

    public setVecPoints(positions: Float32Array[]) {
        this.setPoints(positions.map((p) => Array.from(p)).flat());
    }

    public setPoints(positions: number[]) {
        this.buffer.bufferData(new Float32Array(positions), this.glContext.gl.STATIC_DRAW);
        this.bufferSize = positions.length / this.size;
    }

    public render(positionAttributeLocation: number) {
        const gl = this.glContext.gl;
        this.buffer.bindBuffer();
        gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);
        gl.drawArrays(gl.LINE_STRIP, 0, this.bufferSize);
    }
}
