// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlBuffer, GlContext, GlProgram} from "../gl";
import Renderable from "../scene/renderable";

export default class Cylinder implements Renderable {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer
    private readonly bufferSize: number;
    private circlePoints: number;

    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;
    private buffer: GlBuffer;
    private lateralIndexBuffer: GlBuffer;
    private faceIndexBuffer: GlBuffer;

    constructor(glContext: GlContext, glProgram: GlProgram, circlePoints: number) {
        this.glContext = glContext;
        this.glProgram = glProgram;
        const gl = glContext.gl;
        this.type = gl.FLOAT;
        this.buffer = new GlBuffer(gl);
        this.lateralIndexBuffer = new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);
        this.faceIndexBuffer = new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);
        this.circlePoints = circlePoints;
        const positions = this.buildPoints();
        const lateralIndexes = this.buildLateralIndexes();
        const faceIndexes = this.buildFaceIndexes();

        this.buffer.bufferData(new Float32Array(positions), gl.STATIC_DRAW);
        this.lateralIndexBuffer.bufferData(new Uint16Array(lateralIndexes), gl.STATIC_DRAW);
        this.faceIndexBuffer.bufferData(new Uint16Array(faceIndexes), gl.STATIC_DRAW);
        this.bufferSize = positions.length / this.size;
    }

    public render() {
        const gl = this.glContext.gl;
        this.buffer.bindBuffer();
        const positionAttributeLocation = this.glProgram.getAttribLocation("aPosition");

        gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);
        this.faceIndexBuffer.bindBuffer();
        gl.drawElements(gl.TRIANGLE_FAN, this.circlePoints + 1, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLE_FAN, this.circlePoints + 1, gl.UNSIGNED_SHORT, (this.circlePoints + 1) * 2);

        gl.drawArrays(gl.LINE_STRIP, 0, this.circlePoints + 1);
        gl.drawArrays(gl.LINE_STRIP, this.circlePoints + 1, this.circlePoints + 1);
        this.lateralIndexBuffer.bindBuffer();
        gl.drawElements(gl.TRIANGLE_STRIP, this.circlePoints * 2, gl.UNSIGNED_SHORT, 0);
    }

    private buildPoints(): number[] {
        const points: number[] = new Array();
        for (let height = 0; height <= 1; height++) {
            points.push(0);
            points.push(0);
            points.push(height);
            for (let i = 0; i < this.circlePoints; i++) {
                const angle = (Math.PI * 2 / (this.circlePoints - 1)) * i;
                points.push(Math.cos(angle));
                points.push(Math.sin(angle));
                points.push(height);
            }
        }
        return points;
    }

    private buildFaceIndexes(): number[] {
        const points: number[] = new Array();
        const totalIndexes = (this.circlePoints + 1) * 2;
        for (let i = 0; i < totalIndexes; i++) {
            points.push(i);
        }
        return points;
    }

    private buildLateralIndexes(): number[] {
        const points: number[] = new Array();
        for (let i = 1; i < this.circlePoints; i++) {
            points.push(i);
            points.push(i + this.circlePoints + 1);
        }
        points.push(2);
        points.push(2 + this.circlePoints);
        return points;
    }
}
