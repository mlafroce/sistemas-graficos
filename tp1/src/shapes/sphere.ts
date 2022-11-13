import {GlContext, GlProgram} from "../gl";
import {Surface} from "./surface";

export default class Sphere extends Surface {
    private readonly radio: number;

    constructor(glContext: GlContext, glProgram: GlProgram, radio: number, filas: number, columnas: number) {
        super(glContext, glProgram, filas, columnas);
        this.radio = radio;
    }

    protected getPosition(u: number, v: number): number[] {
        const centerU = u - 0.5;
        const centerV = v - 0.5;
        const x = this.radio * Math.cos(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const y = this.radio * Math.sin(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const z = this.radio * Math.sin(Math.PI * centerV);
        return [x, y, z];
    }

    public getNormal(u: number, v: number): number[] {
        const centerU = u - 0.5;
        const centerV = v - 0.5;
        const x = Math.cos(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const y = Math.sin(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const z = Math.sin(Math.PI * centerV);
        return [x, y, z];
    }

    public getTextureCoords(u: number, v: number): number[] {
        return [u, v];
    }
}
