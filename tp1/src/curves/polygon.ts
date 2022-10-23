import { GlBuffer } from "../gl";

export default class Polygon {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer

    private gl: WebGLRenderingContext;
    private buffer: GlBuffer;
    private bufferSize: number = 0;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.buffer = new GlBuffer(this.gl);
        this.type = this.gl.FLOAT;
    }

    public setVecPoints(positions: Float32Array[]) {
        this.setPoints(positions.map((p) => Array.from(p)).flat());
    }

    public setPoints(positions: number[]) {
        this.buffer.bufferData(new Float32Array(positions), this.gl.STATIC_DRAW);
        this.bufferSize = positions.length / this.size;
    }

    public render(positionAttributeLocation: number) {
        this.buffer.bindBuffer();
        this.gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.bufferSize);
    }
}
