// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
import {GlContext, GlProgram} from "../../gl";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import CastleFloor from "./castleFloor";
import CastleTower from "./castleTower";

export default class Castle extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);

        for (let i = 0; i < config.pisosCastillo; i++) {
            const castleBody = new CastleFloor(glContext, glProgram, config);
            const bodyMat = mat4.create();
            const position = [0, 0, i];
            mat4.fromTranslation(bodyMat, position);
            castleBody.setBaseModelMatrix(bodyMat);
            this.addChild(castleBody);
        }

        const towerPositions = [
            [-config.anchoCastillo / 2, -config.largoCastillo / 2, 0],
            [-config.anchoCastillo / 2, config.largoCastillo / 2, 0],
            [config.anchoCastillo / 2, -config.largoCastillo / 2, 0],
            [config.anchoCastillo / 2, config.largoCastillo / 2, 0],
        ];

        for (const position of towerPositions) {
            const tower = new CastleTower(glContext, glProgram, config);
            const towerMat = mat4.create();
            mat4.fromTranslation(towerMat, position);
            mat4.scale(towerMat, towerMat, [0.25, 0.25, 1]);
            tower.setBaseModelMatrix(towerMat);
            this.addChild(tower);
        }
    }
}
