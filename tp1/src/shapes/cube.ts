// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlBuffer, GlContext, GlProgram} from "../gl";
import Renderable from "../scene/renderable";

export default class Cube implements Renderable {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer
    private readonly bufferSize: number;
    private readonly indexes = [0, 1, 2, 3, 6, 7, 7, 3, 5, 1, 4, 0, 0, 2, 4, 6, 5, 7];

    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;
    private buffer: GlBuffer;
    private indexBuffer: GlBuffer;

    constructor(glContext: GlContext, glProgram: GlProgram) {
        this.glContext = glContext;
        this.glProgram = glProgram;
        const gl = glContext.gl;
        this.type = gl.FLOAT;
        this.buffer = new GlBuffer(gl);
        this.indexBuffer = new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);

        const positions = [
            0, 0, 0,
            0, 0, 1,
            0, 1, 0,
            0, 1, 1,
            1, 0, 0,
            1, 0, 1,
            1, 1, 0,
            1, 1, 1,
        ];
        this.buffer.bufferData(new Float32Array(positions), gl.STATIC_DRAW);
        this.indexBuffer.bufferData(new Uint16Array(this.indexes), gl.STATIC_DRAW);
        this.bufferSize = positions.length / this.size;
    }

    public render() {
        const gl = this.glContext.gl;
        this.buffer.bindBuffer();
        this.indexBuffer.bindBuffer();
        const positionAttributeLocation = this.glProgram.getAttribLocation("a_position");

        gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);
        gl.drawElements(gl.TRIANGLE_STRIP, this.indexes.length, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.LINE_STRIP, this.indexes.length, gl.UNSIGNED_SHORT, 0);
    }
}
