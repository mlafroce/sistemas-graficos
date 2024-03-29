// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlBuffer, GlContext, GlProgram} from "../gl";
import Renderable from "../scene/renderable";
import Texture from "../scene/texture";

export class Square implements Renderable {
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
    public nTextures = 0;

    constructor(glContext: GlContext, glProgram: GlProgram,
                positions: number[], normal: number[], uvIndexes: number[]) {
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

    public setUvIndexes(x: number, y: number) {
        const uvIndexes = [0, 0, 0, x, y, 0, y, x];
        this.uvBuffer.bufferData(new Float32Array(uvIndexes), this.glContext.gl.STATIC_DRAW);
    }

    public render() {
        const gl = this.glContext.gl;
        // normals
        const normalFragAttr = this.glProgram.getAttribLocation("aNormal");
        if (normalFragAttr >= 0) {
            this.normalBuffer.bindBuffer();
            gl.vertexAttribPointer(normalFragAttr, this.size, this.type, this.normalize, this.stride, this.offset);
        }

        // pos attribute
        this.positionBuffer.bindBuffer();
        const positionAttributeLocation = this.glProgram.getAttribLocation("aPosition");
        gl.vertexAttribPointer(
            positionAttributeLocation, this.size, this.type, this.normalize, this.stride, this.offset);

        this.uvBuffer.bindBuffer();
        const textureUVAttribLoc = this.glProgram.getAttribLocation("aTextureUV");
        gl.vertexAttribPointer(
            textureUVAttribLoc, 2, this.type, this.normalize, this.stride, this.offset);

        const nTexturesLoc = this.glProgram.getUniformLocation("nTextures");
        gl.uniform1i(nTexturesLoc, this.nTextures);
        this.indexBuffer.bindBuffer();
        gl.drawElements(gl.TRIANGLE_STRIP, this.indexes.length, gl.UNSIGNED_SHORT, 0);
    }
}

export default class Cube implements Renderable {
    public readonly glContext: GlContext;
    public readonly glProgram: GlProgram;
    private faces: Square[];
    public texture: Texture | undefined;

    constructor(glContext: GlContext, glProgram: GlProgram, topBottomFaces: boolean = true) {
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
        facePoints = [1, 0, 0,
            1, 0, 1,
            1, 1, 0,
            1, 1, 1,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [1, 0, 0], uvIndexes));
        facePoints = [0, 0, 0,
            0, 0, 1,
            1, 0, 0,
            1, 0, 1,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [0, -1, 0], uvIndexes));
        facePoints = [0, 1, 0,
            0, 1, 1,
            1, 1, 0,
            1, 1, 1,
        ];
        this.faces.push(new Square(glContext, glProgram, facePoints, [0, 1, 0], uvIndexes));
        if (topBottomFaces) {
            facePoints = [0, 0, 0,
                1, 0, 0,
                0, 1, 0,
                1, 1, 0,
            ];
            this.faces.push(new Square(glContext, glProgram, facePoints, [0, 0, -1], uvIndexes));
            facePoints = [0, 0, 1,
                1, 0, 1,
                0, 1, 1,
                1, 1, 1,
            ];
            this.faces.push(new Square(glContext, glProgram, facePoints, [0, 0, 1], uvIndexes));
        }
    }

    // @param axis: 0 -> x, 1 -> y, 2 -> z
    public scaleAxisTextures(axis: number, x: number , y: number) {
        this.faces[axis * 2].setUvIndexes(x, y);
        this.faces[axis * 2 + 1].setUvIndexes(x, y);
    }

    public render() {
        let nTextures = 0;
        if (this.texture) {
            this.texture.activate();
            nTextures = 1;
        }
        for (const face of this.faces) {
            face.nTextures = nTextures;
            face.render();
        }
    }
}
