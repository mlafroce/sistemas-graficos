import { GlBuffer } from "../gl";

export default class Square {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer
    private readonly bufferSize: number;
    private readonly indexes = [0, 1, 2, 3, 6, 7, 7, 3, 5, 1, 4, 0, 0, 2, 4, 6, 5, 7];

    private readonly gl: WebGLRenderingContext;
    private buffer: GlBuffer;
    private indexBuffer: GlBuffer;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.type = this.gl.FLOAT;
        this.buffer = new GlBuffer(this.gl);
        this.indexBuffer = new GlBuffer(this.gl, gl.ELEMENT_ARRAY_BUFFER);

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
        this.buffer.bufferData(new Float32Array(positions), this.gl.STATIC_DRAW);
        this.indexBuffer.bufferData(new Uint16Array(this.indexes), this.gl.STATIC_DRAW);
        this.bufferSize = positions.length / this.size;
    }

    public render(positionAttributeLocation: number) {
        this.buffer.bindBuffer();
        this.indexBuffer.bindBuffer();
        this.gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);
        // this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.indexes.length, this.gl.UNSIGNED_SHORT, 0);
        this.gl.drawElements(this.gl.LINE_STRIP, this.indexes.length, this.gl.UNSIGNED_SHORT, 0);
    }
}
