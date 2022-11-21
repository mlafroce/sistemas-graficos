// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";

export default interface Path {
    points: Float32Array[];
    tangents: Float32Array[];
    normals: Float32Array[];
    binormals: Float32Array[];

    getLength(): number;
}

export class CompositePath implements Path {
    public points: Float32Array[] = new Array();
    public tangents: Float32Array[] = new Array();
    public normals: Float32Array[] = new Array();
    public binormals: Float32Array[] = new Array();

    public addPath(path: Path) {
        this.points.push(...path.points);
        this.tangents.push(...path.tangents);
        this.normals.push(...path.normals);
        this.binormals.push(...path.binormals);
    }

    public static getPathLength(path: vec3[]): number {
        let length = 0;
        for (let i = 1; i < path.length; i++) {
            const delta = vec3.create();
            vec3.sub(delta, path[i], path[i - 1]);
            length += vec3.length(delta);
        }
        return length;
    }

    public getLength(): number {
        return CompositePath.getPathLength(this.points);
    }

    /**
     * Create a 3d path from an array of points
     * @param path points to follow. If z component is 0, a binormal [0, 0, 1] is chosen
     */
    public static fromPoints(path: vec3[]): CompositePath {
        const output = new CompositePath();
        for (let i = 0; i < path.length - 1; i++) {
            const tangent = vec3.create();
            vec3.sub(tangent, path[i + 1], path[i]);
            vec3.normalize(tangent, tangent);
            const binormal = getBinormal(tangent);
            const normal = vec3.create();
            vec3.cross(normal, binormal, tangent);
            output.points.push(path[i]);
            output.tangents.push(tangent);
            output.normals.push(normal);
            output.binormals.push(binormal);
        }
        // Add last point and duplicate last tangents and normals
        output.points.push(path[path.length - 1]);
        output.tangents.push(output.tangents[output.tangents.length - 1]);
        output.normals.push(output.normals[output.normals.length - 1]);
        return output;
    }
}

function getBinormal(tangent: vec3): vec3 {
    if (tangent[2] === 0) {
        return vec3.fromValues(0, 0, 1);
    } else {
        const normZ = tangent[0] / tangent[2];
        const auxNormal = vec3.fromValues(1, 0, normZ);
        vec3.normalize(auxNormal, auxNormal);
        return auxNormal;
    }
}
