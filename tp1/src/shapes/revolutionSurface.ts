// @ts-ignore
import * as mat3 from "gl-matrix/esm/mat3";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec2 from "gl-matrix/esm/vec2";
// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import Path, {CompositePath} from "../curves/path";
import {GlContext, GlProgram} from "../gl";
import {Surface} from "./surface";
import {SweepSurface} from "./sweepSurface";

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
    private readonly normals: vec3[];
    private readonly textureCoords: vec2[];

    constructor(glContext: GlContext, glProgram: GlProgram, shape: Path, angle: number, rows: number) {
        super(glContext, glProgram, rows - 1, shape.points.length - 1);
        this.points = [];
        this.normals = [];
        this.textureCoords = [];
        const angleStep = angle / (rows - 1);
        // Since we only rotate around Z axis, we can fix normal matrix
        const shapeLen = shape.getLength();
        let curPointColLen = 0;
        for (let i = 0; i < rows; ++i) {
            const curAngle = angleStep * i;
            const pathMat = mat4.create();
            mat4.fromZRotation(pathMat, curAngle);
            // Our shape lives in XY plane, lets move it to XZ
            mat4.rotateX(pathMat, pathMat, Math.PI / 2);

            const rowPoints = [];
            for (const shapePoint of shape.points) {
                const extPoint = vec4.fromValues(...shapePoint, 1);
                const point4d = vec4.create();
                vec4.transformMat4(point4d, extPoint, pathMat);
                const point3d = vec3.fromValues(...point4d);
                this.points.push(point3d);
                rowPoints.push(point3d);
            }

            for (const shapeNormal of shape.normals) {
                const normal = vec4.fromValues(...shapeNormal, 0);
                vec4.transformMat4(normal, normal, pathMat);
                const normalv3 = vec3.fromValues(...normal);
                vec3.normalize(normalv3, normalv3);
                this.normals.push(normalv3);
            }

            let curPointRowLen = 0;
            for (let j = 0; j < shape.points.length; j++) {
                if (j === 0) {
                    // First point of i-th row, if not first row, lets see how far did we get
                    if (i !== 0) {
                        curPointColLen += angleStep;
                    }
                    const texCoord = vec2.fromValues(0, curPointColLen / angle);
                    this.textureCoords.push(texCoord);
                } else {
                    const delta = vec3.create();
                    vec3.sub(delta, shape.points[j], shape.points[j - 1]);
                    curPointRowLen += vec3.length(delta);
                    const texCoord = vec2.fromValues(curPointRowLen / shapeLen, curPointColLen / angle);
                    this.textureCoords.push(texCoord);
                }
            }
        }
    }

    public render() {
        super.render();
    }

    public getTextureCoords(x: number, y: number): number[] {
        const texIdx = this.getIndexFromXY(x, y);
        return this.textureCoords[texIdx];
    }

    protected getPosition(x: number, y: number): number[] {
        const pointIdx = this.getIndexFromXY(x, y);
        const point = this.points[pointIdx];
        return [... point];
    }

    protected getNormal(x: number, y: number): number[] {
        const normalIdx = this.getIndexFromXY(x, y);
        const normal = this.normals[normalIdx];
        return [... normal];
    }
}
