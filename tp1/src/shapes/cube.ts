// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlBuffer, GlContext, GlProgram} from "../gl";
import Renderable from "../scene/renderable";

class Square implements Renderable {
    private readonly size = 3;          // 3components per iteration
    private readonly type: number;      // the data is 32bit floats
    private readonly normalize = false; // don't normalize the data
    private readonly stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    private readonly offset = 0;        // start at the beginning of the buffer

    private readonly positions: number[];
    private readonly normals: number[];
    private readonly uvIndexes: number[];
    private readonly indexes: number[];
    private readonly positionBuffer: GlBuffer;
    private readonly normalBuffer: GlBuffer;
    private readonly indexBuffer: GlBuffer;
    private readonly uvBuffer: GlBuffer;
    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;

    constructor(glContext: GlContext, glProgram: GlProgram, positions: number[], normal: number[], uvIndexes: number[]) {
        this.glContext = glContext;
        this.glProgram = glProgram;
        const gl = glContext.gl;
        this.type = gl.FLOAT;
        this.positions = positions;
        this.normals = [];
        this.indexes = [0, 1, 2, 3];
        this.uvIndexes = uvIndexes;
        for (const i of this.indexes) {
            this.normals.push(...normal);
        }

        this.positionBuffer = new GlBuffer(gl);
        this.normalBuffer = new GlBuffer(gl);
        this.uvBuffer = new GlBuffer(gl);
        this.indexBuffer = new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);
        this.positionBuffer.bufferData(new Float32Array(this.positions), gl.STATIC_DRAW);
        this.indexBuffer.bufferData(new Uint16Array(this.indexes), gl.STATIC_DRAW);
        this.normalBuffer.bufferData(new Float32Array(this.normals), gl.STATIC_DRAW);
        this.uvBuffer.bufferData(new Float32Array(this.uvIndexes), gl.STATIC_DRAW);
    }

    public render() {
        const gl = this.glContext.gl;
        // normals
        this.normalBuffer.bindBuffer();
        const normalFragAttr = this.glProgram.getAttribLocation("aNormal");
        gl.vertexAttribPointer(normalFragAttr, this.size, this.type, this.normalize, this.stride, this.offset);

        // pos attribute
        this.positionBuffer.bindBuffer();
        const positionAttributeLocation = this.glProgram.getAttribLocation("aPosition");
        gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);

        this.uvBuffer.bindBuffer();
        const textureUVAttribLoc = this.glProgram.getAttribLocation("aTextureUV");
        gl.vertexAttribPointer(
            textureUVAttribLoc, 2, this.type, this.normalize, this.stride, this.offset);

        this.indexBuffer.bindBuffer();
        gl.drawElements(gl.TRIANGLE_STRIP, this.indexes.length, gl.UNSIGNED_SHORT, 0);
    }
}

export default class Cube implements Renderable {
    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;
    private faces: Square[];

    constructor(glContext: GlContext, glProgram: GlProgram) {
        this.glContext = glContext;
        this.glProgram = glProgram;
        this.faces = [];
        const uvIndexes = [0, 0, 0, 1, 1, 0, 1, 1];
        let facePoints = [0, 0, 0,
            0, 0, 1,
            0, 1, 0,
            0, 1, 1,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [-1, 0, 0], uvIndexes));
        facePoints = [0, 0, 0,
            0, 0, 1,
            1, 0, 0,
            1, 0, 1,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [0, -1, 0], uvIndexes));
        facePoints = [0, 0, 0,
            1, 0, 0,
            0, 1, 0,
            1, 1, 0,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [0, 0, -1], uvIndexes));

        facePoints = [1, 0, 0,
            1, 0, 1,
            1, 1, 0,
            1, 1, 1,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [1, 0, 0], uvIndexes));
        facePoints = [0, 1, 0,
            0, 1, 1,
            1, 1, 0,
            1, 1, 1,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [0, 1, 0], uvIndexes));
        facePoints = [0, 0, 1,
            1, 0, 1,
            0, 1, 1,
            1, 1, 1,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [0, 0, 1], uvIndexes));
    }

    public render() {
        for (const face of this.faces) {
            face.render();
        }
    }
}
