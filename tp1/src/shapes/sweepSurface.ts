// @ts-ignore
import * as mat3 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec2 from "gl-matrix/esm/vec2";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {CubicBezier} from "../curves/bezier";
import Path, {CompositePath} from "../curves/path";
import {GlContext, GlProgram} from "../gl";
import {Surface} from "./surface";

export class SweepSurface extends Surface {
    private readonly points: vec3[];
    private readonly normals: vec3[];
    private readonly textureCoords: vec2[];

    constructor(glContext: GlContext, glProgram: GlProgram, shape: Path, path: CubicBezier) {
        const rows = path.points.length;
        super(glContext, glProgram, rows - 1, shape.points.length - 1);
        this.points = [];
        this.normals = [];
        this.textureCoords = [];
        const pathLen = path.getLength();
        let curPointColLen = 0;
        for (let i = 0; i < rows; ++i) {
            const pathMat = mat4.fromValues(
                ... path.normals[i], 0,
                ... path.binormals[i], 0,
                ... path.tangents[i], 0,
                ... path.points[i], 1);

            const rowPoints = [];
            for (const shapePoint of shape.points) {
                const point = vec3.create();
                vec3.transformMat4(point, shapePoint, pathMat);
                this.points.push(point);
                rowPoints.push(point);
            }

            for (const shapeNormal of shape.normals) {
                const normal = vec4.fromValues(...shapeNormal, 0);
                vec4.transformMat4(normal, normal, pathMat);
                const normalv3 = vec3.fromValues(...normal);
                vec3.normalize(normalv3, normalv3);
                this.normals.push(normalv3);
            }

            const rowLength = CompositePath.getPathLength(rowPoints);
            const delta = vec3.create();
            if (i !== 0) {
                vec3.sub(delta, path.points[i], path.points[i - 1]);
                curPointColLen += vec3.length(delta) / pathLen;
            }
            let curPointRowLen = 0;
            for (let j = 0; j < shape.points.length; j++) {
                if (j === 0) {
                    const texCoord = vec2.fromValues(0, curPointColLen / pathLen);
                    this.textureCoords.push(texCoord);
                } else {
                    vec3.sub(delta, shape.points[j], shape.points[j - 1]);
                    curPointRowLen += vec3.length(delta);
                    const texCoord = vec2.fromValues(curPointRowLen / rowLength, curPointColLen / pathLen);
                    this.textureCoords.push(texCoord);
                }
            }
        }
    }

    public getTextureCoords(x: number, y: number): number[] {
        const texIdx = this.getIndexFromXY(x, y);
        return this.textureCoords[texIdx];
    }

    protected getNormal(x: number, y: number): number[] {
        const normalIdx = this.getIndexFromXY(x, y);
        const normal = this.normals[normalIdx];
        return [... normal];
    }

    protected getPosition(x: number, y: number): number[] {
        const pointIdx = this.getIndexFromXY(x, y);
        const point = this.points[pointIdx];
        return [... point];
    }
}
