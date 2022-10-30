// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlBuffer, GlContext, GlProgram} from "../gl";
import Renderable from "../scene/renderable";

export abstract class Surface implements Renderable {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer

    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;
    private positionBuffer: GlBuffer;
    private normalBuffer: GlBuffer;
    private uvBuffer: GlBuffer;
    private indexBuffer: GlBuffer;
    private indexesSize: number;
    protected filas: number;
    protected columnas: number;

    protected constructor(glContext: GlContext, glProgram: GlProgram, filas: number, columnas: number) {
        this.glContext = glContext;
        this.glProgram = glProgram;
        const gl = this.glContext.gl;
        this.type = gl.FLOAT;
        this.positionBuffer = new GlBuffer(gl);
        this.normalBuffer = new GlBuffer(gl);
        this.uvBuffer = new GlBuffer(gl);
        this.indexBuffer = new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);
        this.indexesSize = 0;
        this.filas = filas;
        this.columnas = columnas;
    }

    public build() {
        this.generateSurface(this.filas, this.columnas);
        this.generateIndexArray(this.filas, this.columnas);
    }

    protected abstract getPosition(u: number, v: number): number[];

    protected abstract getNormal(u: number, v: number): number[];

    protected abstract getTextureCoords(u: number, v: number): number[];

    public render() {
        const gl = this.glContext.gl;
        this.positionBuffer.bindBuffer();
        this.indexBuffer.bindBuffer();
        const positionAttributeLocation = this.glProgram.getAttribLocation("a_position");
        gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);
        gl.drawElements(gl.TRIANGLE_STRIP, this.indexesSize, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.LINE_STRIP, this.indexesSize, gl.UNSIGNED_SHORT, 0);
    }

    private generateSurface(filas: number, columnas: number) {
        const positionArray = [];
        const normalArray = [];
        const uvArray = [];
        for (let i = 0; i <= filas; i++) {
            for (let j = 0; j <= columnas; j++) {
                const uv = this.getUV(j, i);
                const pos = this.getPosition(uv[0], uv[1]);

                positionArray.push(pos[0]);
                positionArray.push(pos[1]);
                positionArray.push(pos[2]);

                const nrm = this.getNormal(uv[0], uv[1]);

                normalArray.push(nrm[0]);
                normalArray.push(nrm[1]);
                normalArray.push(nrm[2]);

                const uvs = this.getTextureCoords(uv[0], uv[1]);

                uvArray.push(uvs[0]);
                uvArray.push(uvs[1]);
            }
        }
        const gl = this.glContext.gl;
        this.positionBuffer.bufferData(new Float32Array(positionArray), gl.STATIC_DRAW);
        this.normalBuffer.bufferData(new Float32Array(normalArray), gl.STATIC_DRAW);
        this.uvBuffer.bufferData(new Float32Array(uvArray), gl.STATIC_DRAW);
    }

    private generateIndexArray(filas: number, columnas: number) {
        const indexArray = [];

        for (let i = 0; i < filas; i++) {
            for (let j = 0; j <= columnas; j++) {
                let col = j;
                if (i % 2 !== 0) {
                    col = columnas - j;
                }
                indexArray.push(this.getIndexFromXY(col, i));
                indexArray.push(this.getIndexFromXY(col, i + 1));
            }
        }
        this.indexesSize = indexArray.length;
        this.indexBuffer.bufferData(new Uint16Array(indexArray), this.glContext.gl.STATIC_DRAW);
    }

    protected getUV(x: number, y: number): number[] {
        return [x / this.columnas, y / this.filas];
    }

    protected getIndexFromXY(x: number, y: number) {
        return x + y * (this.columnas + 1);
    }
}

export class Sphere extends Surface {
    private readonly radio: number;

    constructor(glContext: GlContext, glProgram: GlProgram, radio: number, filas: number, columnas: number) {
        super(glContext, glProgram, filas, columnas);
        this.radio = radio;
    }

    protected getPosition(u: number, v: number): number[] {
        const centerU = u - 0.5;
        const centerV = v - 0.5;
        const x = this.radio * Math.cos(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const y = this.radio * Math.sin(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const z = this.radio * Math.sin(Math.PI * centerV);
        return [x, y, z];
    }

    public getNormal(u: number, v: number): number[] {
        const centerU = u - 0.5;
        const centerV = v - 0.5;
        const x = Math.cos(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const y = Math.sin(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const z = Math.sin(Math.PI * centerV);
        return [x, y, z];
    }

    public getTextureCoords(u: number, v: number): number[] {
        return [u, v];
    }
}
