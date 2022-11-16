// @ts-ignore
import * as mat3 from "gl-matrix/esm/mat3";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import Path from "../curves/path";
import {GlContext, GlProgram} from "../gl";
import {Surface} from "./surface";

/**
 * @param glContext: parent Gl Context
 * @param glProgram: shader for resulting surface
 * @param shape: line to revolve
 * @param angle: spinning angle
 * @param rows: revolution steps
 * TODO: set revolution axis, currently spinning around origin and z axis
 * TODO: improve normal calculations
 */
export default class RevolutionSurface extends Surface {
    private readonly points: vec3[];
    public readonly normals: vec3[];

    constructor(glContext: GlContext, glProgram: GlProgram, shape: Path, angle: number, rows: number) {
        super(glContext, glProgram, rows - 1, shape.points.length - 1);
        this.points = [];
        this.normals = [];
        const angleStep = angle / (rows - 1);
        // Since we only rotate around Z axis, we can fix normal matrix
        for (let i = 0; i < rows; ++i) {
            const curAngle = angleStep * i;
            const row1 = [Math.sin(curAngle), Math.cos(curAngle), 0, 0];
            const row2 = [Math.cos(curAngle), -Math.sin(curAngle), 0, 0];
            const row3 = [0, 0, 1, 0];
            const positionVector = [0, 0, 0, 1];

            const pathMat = mat4.fromValues(
                ... row1,
                ... row2,
                ... row3,
                ... positionVector);

            for (const shapePoint of shape.points) {
                const extPoint = vec4.fromValues(...shapePoint, 1);
                const point4d = vec4.create();
                vec4.transformMat4(point4d, extPoint, pathMat);
                const point3d = vec3.fromValues(...point4d);
                this.points.push(point3d);
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

    protected getPosition(u: number, v: number): number[] {
        const pointIdx = this.getIndexFromXY(u, v);
        const point = this.points[pointIdx];
        return [... point];
    }

    protected getNormal(u: number, v: number): number[] {
        const normalIdx = this.getIndexFromXY(u, v);
        const normal = this.normals[normalIdx];
        return [... normal];
    }

    protected getUV(x: number, y: number): number[] {
        return [x, y];
    }
}
