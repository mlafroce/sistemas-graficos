// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";

// const vec3 = GlMatrix.vec3;

function combinations(n: number, k: number): number {
    // Optimization
    const aux = k < n / 2 ? k : n - k;
    let lower = 1;
    let upper = 1;
    for (let i = 0; i < aux; i++) {
        upper *= (n - i);
        lower *= (i + 1);
    }
    return upper / lower;
}

export default class Bezier {
    public static build_generic_1d(controlPoints: number[], curvePoints: number): number[] {
        const order = controlPoints.length - 1;
        const result: number[] = new Array();
        for (let i = 0; i < curvePoints; i++) {
            const u = i / (curvePoints - 1);
            // Bezier poly for each U
            let pu = 0;
            for (let j = 0; j <= order; j++) {
                const comb = combinations(order, j);
                const uPow1 = Math.pow(1 - u, order - j);
                const uPow2 = Math.pow(u, j);
                pu += comb * uPow1 * uPow2 * controlPoints[j];
            }
            result.push(pu);
        }
        return result;
    }
}

export class CubicBezier {
    public points: Float32Array[];
    public tangents: Float32Array[];
    public normals: Float32Array[];
    public binormals: Float32Array[];

    constructor(controlPoints: number[], curvePoints: number) {
        this.points = new Array();
        this.tangents = new Array();
        this.normals = new Array();
        this.binormals = new Array();

        const controlPointsAux = [new Array(), new Array(), new Array()];
        const points = controlPoints.length;
        for (let i = 0; i < points; i++) {
            controlPointsAux[i % 3].push(controlPoints[i]);
        }
        // Positions
        const xbezPoints = Bezier.build_generic_1d(controlPointsAux[0], curvePoints);
        const ybezPoints = Bezier.build_generic_1d(controlPointsAux[1], curvePoints);
        const zbezPoints = Bezier.build_generic_1d(controlPointsAux[2], curvePoints);
        for (let i = 0; i < xbezPoints.length; i++) {
            const v = vec3.fromValues([xbezPoints[i]], ybezPoints[i], zbezPoints[i]);
            this.points.push(v);
        }

        // Tangents
        const xbezTans = CubicBezier.build_cubic_tangent_1d(controlPointsAux[0], curvePoints);
        const ybezTans = CubicBezier.build_cubic_tangent_1d(controlPointsAux[1], curvePoints);
        const zbezTans = CubicBezier.build_cubic_tangent_1d(controlPointsAux[2], curvePoints);
        for (let i = 0; i < xbezPoints.length; i++) {
            const v = vec3.fromValues([xbezTans[i]], ybezTans[i], zbezTans[i]);
            this.tangents.push(vec3.normalize(v, v));
        }

        // Normals
        const xbezNorms = CubicBezier.build_cubic_normal_1d(controlPointsAux[0], curvePoints);
        const ybezNorms = CubicBezier.build_cubic_normal_1d(controlPointsAux[1], curvePoints);
        const zbezNorms = CubicBezier.build_cubic_normal_1d(controlPointsAux[2], curvePoints);
        for (let i = 0; i < xbezPoints.length; i++) {
            const v = vec3.fromValues([xbezNorms[i]], ybezNorms[i], zbezNorms[i]);
            this.normals.push(vec3.normalize(v, v));
        }

        // Binormals
        for (let i = 0; i < this.normals.length; i++) {
            const binormal = vec3.create();
            vec3.cross(binormal, this.tangents[i], this.normals[i]);
            this.binormals.push(vec3.normalize(binormal, binormal));
        }
    }

    public static build_cubic_tangent_1d(controlPoints: number[], curvePoints: number): number[] {
        const result: number[] = new Array();
        const p0 = controlPoints[0];
        const p1 = controlPoints[1];
        const p2 = controlPoints[2];
        const p3 = controlPoints[3];
        for (let i = 0; i < curvePoints; i++) {
            const u = i / (curvePoints - 1);
            const pu = 3 * (1 - u) * (1 - u) * (p1 - p0) + 6 * (1 - u) * u * (p2 - p1) + 3 * u * u * (p3 - p2);
            result.push(pu);
        }
        return result;
    }

    public static build_cubic_normal_1d(controlPoints: number[], curvePoints: number): number[] {
        const result: number[] = new Array();
        const p0 = controlPoints[0];
        const p1 = controlPoints[1];
        const p2 = controlPoints[2];
        const p3 = controlPoints[3];
        for (let i = 0; i < curvePoints; i++) {
            const u = i / (curvePoints - 1);
            const pu = 6 * (1 - u) * (p2 - 2 * p1 + p0) + 6 * u * (p3 - 2 * p2 + p1);
            result.push(pu);
        }
        return result;
    }
}
