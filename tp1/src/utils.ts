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
    public sunColor: number = 0xAA9988;
    public torchColor: number = 0xAA9988;
    public ambientColor: number = 0x333333;
    public waterShininess: number = 50;
    public viewNormals: boolean = false;
    public static globalViewNormals = false; // FIXME!!!

    public getAmbientLight(): number[] {
        return this.colorToRGB(this.ambientColor);
    }

    public getSunLight(): number[] {
        return this.colorToRGB(this.sunColor);
    }

    public getTorchLight(): number[] {
        return this.colorToRGB(this.torchColor);
    }

    private colorToRGB(color: number): number[] {
        const b = color % 256 / 256;
        const g = (color / 256) % 256 / 256;
        const r = (color / (256 * 256)) % 256 / 256;
        return [r, g, b];
    }
}
