export default class Perlin1d {
    public static randomSample(from: number, to: number, nSamples: number): number[] {
        const step = (to - from) / (nSamples - 1);
        const gradVector = [];
        for (let s = 0; s < nSamples; s++) {
            const r = Math.random() < 0.5 ? -1 : 1;
            gradVector.push(r);
        }
        const samples = [];
        for (let s = 0; s < nSamples; s++) {
            const r = this.randomPoint(from + step * s, gradVector);
            samples.push(r);
        }
        return samples;
    }

    private static randomPoint(p: number, gradVector: number[]): number {
        const p0 = Math.floor(p);
        const p1 = p0 + 1;

        const t = p - p0;
        const fadeT = Perlin1d.fade(t);

        const g0 = Perlin1d.grad(p0, gradVector);
        const g1 = Perlin1d.grad(p1, gradVector);

        return (1.0 - fadeT) * g0 * (p - p0) + fadeT * g1 * (p - p1);
    }

    private static grad(point: number, gradVector: number[]): number {
        const idx = point % gradVector.length;
        return gradVector[idx];
    }

    private static fade(t: number): number {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }
}
