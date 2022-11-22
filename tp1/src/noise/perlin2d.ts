// @ts-ignore
import * as vec2 from "gl-matrix/esm/vec2";

export default class Perlin2d {
    public static randomSample(xLen: number, xSamples: number): number[] {
        const step = xLen / (xSamples - 1);
        const gradVector = [];
        for (let sx = 0; sx < xSamples; sx++) {
            for (let sy = 0; sy < xSamples; sy++) {
                const r = Math.random() * Math.PI;
                const v = vec2.fromValues(Math.cos(r), Math.sin(r));
                gradVector.push(v);
            }
        }
        const samples = [];
        for (let sx = 0; sx < xSamples; sx++) {
            for (let sy = 0; sy < xSamples; sy++) {
                const point = [step * sx, step * sy];
                const r = this.randomPoint(point, gradVector, xSamples) * 256 + 128;
                samples.push(r);
            }
        }
        return samples;
    }

    private static randomPoint(p: vec2, gradVector: number[], matrixWidth: number): number {
        /* Lattice points */
        const p0 = vec2.fromValues(Math.floor(p[0]), Math.floor(p[1]));
        const p1 = vec2.fromValues(Math.floor(p[0]) + 1, Math.floor(p[1]));
        const p2 = vec2.fromValues(Math.floor(p[0]), Math.floor(p[1] + 1));
        const p3 = vec2.fromValues(Math.floor(p[0]) + 1, Math.floor(p[1] + 1));

        /* Look up gradients at lattice points. */
        const g0 = this.grad(p0[0], p0[1], gradVector, matrixWidth);
        const g1 = this.grad(p1[0], p1[1], gradVector, matrixWidth);
        const g2 = this.grad(p2[0], p2[1], gradVector, matrixWidth);
        const g3 = this.grad(p3[0], p3[1], gradVector, matrixWidth);

        const t0 = p[0] - p0[0];
        const t1 = p[1] - p0[1];
        const fadeT0 = this.fade(t0);
        const fadeT1 = this.fade(t1);

        /* Calculate dot products and interpolate.*/
        const tmp = vec2.create();
        const p0p1 = vec2.dot(g0, vec2.sub(tmp, p, p0)) * (1.0 - fadeT0) +
                     vec2.dot(g1, vec2.sub(tmp, p, p1)) * fadeT0;
        const p2p3 = vec2.dot(g2, vec2.sub(tmp, p, p2)) * (1.0 - fadeT0) +
                     vec2.dot(g3, vec2.sub(tmp, p, p3)) * fadeT0;

        /* Calculate final result */
        return p0p1 * (1.0 - fadeT1) + p2p3 * fadeT1;
    }

    private static grad(x: number, y: number, gradVector: number[], matrixWidth: number): number {
        const idx = x + y * matrixWidth;
        return gradVector[idx];
    }

    private static fade(t: number): number {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }
}
