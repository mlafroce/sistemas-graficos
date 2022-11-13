// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {CubicBezier} from "../curves/bezier";
import {GlContext, GlProgram} from "../gl";
import {Surface} from "./surface";

export class SweepSurface extends Surface {
    private readonly points: vec3[];

    constructor(glContext: GlContext, glProgram: GlProgram, shape: vec3[], path: CubicBezier) {
        const rows = path.points.length;
        super(glContext, glProgram, rows - 1, shape.length - 1);
        this.points = new Array();
        for (let i = 0; i < rows; ++i) {
            const pathMat = mat4.fromValues(
                ... path.normals[i], 0,
                ... path.binormals[i], 0,
                ... path.tangents[i], 0,
                ... path.points[i], 1);
            for (const shapePoint of shape) {
                const extPoint = vec4.fromValues(... shapePoint, 1);
                const point4d = vec4.create();
                vec4.transformMat4(point4d, extPoint, pathMat);
                const point3d = vec3.fromValues(... point4d);
                this.points.push(point3d);
            }
        }
    }

    public getTextureCoords(u: number, v: number): number[] {
        return [];
    }

    protected getNormal(u: number, v: number): number[] {
        return [0.5, 0.5, 0.5]
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
