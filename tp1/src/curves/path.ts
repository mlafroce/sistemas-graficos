// @ts-ignore
import * as vec3 from "gl-matrix/esm/vec3";
import {CubicBezier} from "./bezier";

export default interface Path {
    points: Float32Array[];
    tangents: Float32Array[];
    normals: Float32Array[];
    binormals: Float32Array[];
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

    public static fromPoints(path: vec3[]): CompositePath {
        const output = new CompositePath();
        for (let i = 0; i < path.length - 1; i++) {
            const tangent = vec3.create();
            vec3.sub(tangent, path[i + 1], path[i]);
            vec3.normalize(tangent, tangent);
            const normal = getNormal(tangent);
            output.points.push(path[i]);
            output.tangents.push(tangent);
            output.normals.push(normal);
        }
        // Add last point and duplicate last tangents and normals
        output.points.push(path[path.length - 1]);
        output.tangents.push(output.tangents[output.tangents.length - 1]);
        output.normals.push(output.normals[output.normals.length - 1]);
        return output;
    }
}

function getNormal(tangent: vec3): vec3 {
    if (tangent[2] === 0) {
        return vec3.fromValues(0, 0, 1);
    } else {
        const normZ = tangent[0] / tangent[2];
        const auxNormal = vec3.fromValues(1, 0, normZ);
        vec3.normalize(auxNormal, auxNormal);
        return auxNormal;
    }
}
