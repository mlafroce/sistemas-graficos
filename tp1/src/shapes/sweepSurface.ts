// @ts-ignore
import * as mat3 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {CubicBezier} from "../curves/bezier";
import Path from "../curves/path";
import {GlContext, GlProgram} from "../gl";
import {Surface} from "./surface";

export class SweepSurface extends Surface {
    private readonly points: vec3[];
    private readonly normals: vec3[];

    constructor(glContext: GlContext, glProgram: GlProgram, shape: Path, path: CubicBezier) {
        const rows = path.points.length;
        super(glContext, glProgram, rows - 1, shape.points.length - 1);
        this.points = new Array();
        this.normals = new Array();
        for (let i = 0; i < rows; ++i) {
            const pathMat = mat4.fromValues(
                ... path.normals[i], 0,
                ... path.binormals[i], 0,
                ... path.tangents[i], 0,
                ... path.points[i], 1);

            for (const shapePoint of shape.points) {
                const point = vec3.create();
                vec3.transformMat4(point, shapePoint, pathMat);
                this.points.push(point);
            }

            for (const shapeNormal of shape.normals) {
                const normal = vec4.fromValues(...shapeNormal, 0);
                vec4.transformMat4(normal, normal, pathMat);
                const normalv3 = vec3.fromValues(...normal);
                vec3.normalize(normalv3, normalv3);
                this.normals.push(normalv3);
            }
        }
    }

    public getTextureCoords(u: number, v: number): number[] {
        return [];
    }

    protected getNormal(u: number, v: number): number[] {
        const normalIdx = this.getIndexFromXY(u, v);
        const normal = this.normals[normalIdx];
        return [... normal];
    }

    protected getUV(x: number, y: number): number[] {
        return [x, y];
    }

    protected getPosition(u: number, v: number): number[] {
        const pointIdx = this.getIndexFromXY(u, v);
        const point = this.points[pointIdx];
        return [... point];
    }
}
