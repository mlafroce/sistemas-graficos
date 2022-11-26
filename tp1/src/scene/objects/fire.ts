import {GlBuffer, GlContext, GlProgram} from "../../gl";
import Renderable from "../renderable";

export default class Fire implements Renderable {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer

    private readonly positionBuffer: GlBuffer;
    private readonly indexBuffer: GlBuffer;
    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;

    constructor(glContext: GlContext, glProgram: GlProgram) {
        const gl = glContext.gl;
        this.glContext = glContext;
        this.glProgram = glProgram;
        this.type = gl.FLOAT;
        const positions = [0, 0, 0,
            1, 0, 0,
            0, 1, 0,
            -1, 0, 0,
        ];
        const indexes = [0, 1, 2, 3];
        this.positionBuffer = new GlBuffer(gl);
        this.indexBuffer = new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);
        this.positionBuffer.bufferData(new Float32Array(positions), gl.STATIC_DRAW);
        this.indexBuffer.bufferData(new Uint16Array(indexes), gl.STATIC_DRAW);
    }

    public render() {
        const gl = this.glContext.gl;
        // pos attribute
        this.positionBuffer.bindBuffer();
        const positionAttributeLocation = this.glProgram.getAttribLocation("aPosition");
        gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);
        this.indexBuffer.bindBuffer();
        gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);
    }
}
