export class Config {
    public castleFloors: number = 1;
    public castleLength: number = 2;
    public castleWidth: number = 1.6;
    public nWalls: number = 4;
    public wallHeight: number = 1.5;
    public catapultAngle: number = 0;
    public cameraType: number = 0;
    public gateAngle: number = 0;
    public sunPhi: number = 30;
    public sunTheta: number = 180;
    public sunPos: undefined;
    public sunColor: number = 0x222222;
    public viewNormals: boolean = false;
    public static globalViewNormals = false; // FIXME!!!

    public getAmbientLight(): number[] {
        const b = this.sunColor % 256 / 256;
        const g = (this.sunColor / 256) % 256 / 256;
        const r = (this.sunColor / (256 * 256)) % 256 / 256;
        return [r, g, b];
    }
}
