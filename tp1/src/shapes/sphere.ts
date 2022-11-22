import {GlContext, GlProgram} from "../gl";
import {Surface} from "./surface";

export default class Sphere extends Surface {
    private readonly radio: number;

    constructor(glContext: GlContext, glProgram: GlProgram, radio: number, filas: number, columnas: number) {
        super(glContext, glProgram, filas, columnas);
        this.radio = radio;
    }

    protected getPosition(x: number, y: number): number[] {
        const centerU = x / this.columnas - 0.5;
        const centerV = y / this.filas - 0.5;
        const x1 = this.radio * Math.cos(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const y1 = this.radio * Math.sin(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const z = this.radio * Math.sin(Math.PI * centerV);
        return [x1, y1, z];
    }

    public getNormal(x: number, y: number): number[] {
        const centerU = x / this.columnas - 0.5;
        const centerV = y / this.filas - 0.5;
        const x1 = Math.cos(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const y1 = Math.sin(2 * Math.PI * centerU) * Math.cos(Math.PI * centerV);
        const z = Math.sin(Math.PI * centerV);
        return [x1, y1, z];
    }

    public getTextureCoords(x: number, y: number): number[] {
        return [x / this.columnas, y / this.filas];
    }
}
