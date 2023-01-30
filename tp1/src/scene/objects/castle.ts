// @ts-ignore
import * as mat2 from "gl-matrix/esm/mat2";
// @ts-ignore
import * as mat4 from "gl-matrix/esm/mat4";
// @ts-ignore
import * as vec4 from "gl-matrix/esm/vec4";
import {GlContext, GlProgram} from "../../gl";
import {Config} from "../../utils";
import {CompositeObject} from "../compositeObject";
import CastleFloor from "./castleFloor";
import CastleTower from "./castleTower";
import CastleRoof from "./castleRoof";

export default class Castle extends CompositeObject {
    constructor(glContext: GlContext, glProgram: GlProgram, config: Config) {
        super(glContext, glProgram);
        this.build(config);
    }

    public onConfigChanged(config: Config) {
        super.onConfigChanged(config);
        this.childList.length = 0;
        this.build(config);
    }

    private build(config: Config) {
        for (let i = 0; i < config.castleFloors; i++) {
            const castleBody = new CastleFloor(this.glContext, this.glProgram, config);
            const bodyMat = mat4.create();
            const position = [0, 0, i];
            mat4.fromTranslation(bodyMat, position);
            castleBody.setBaseModelMatrix(bodyMat);
            castleBody.baseColor = vec4.fromValues(0.8, 0.8, 0.4, 1);
            this.addChild(castleBody);
        }

        const towerPositions = [
            [-config.castleWidth / 2, -config.castleLength / 2, 0],
            [-config.castleWidth / 2, config.castleLength / 2, 0],
            [config.castleWidth / 2, -config.castleLength / 2, 0],
            [config.castleWidth / 2, config.castleLength / 2, 0],
        ];

        for (const position of towerPositions) {
            const tower = new CastleTower(this.glContext, this.glProgram, config);
            const towerMat = mat4.create();
            mat4.fromTranslation(towerMat, position);
            mat4.scale(towerMat, towerMat, [0.25, 0.25, 1]);
            tower.setBaseModelMatrix(towerMat);
            this.addChild(tower);
        }

        const roof = new CastleRoof(this.glContext, this.glProgram, config);
        const position = [0, 0, config.castleFloors - 0.02];
        const roofMat = mat4.create();
        mat4.fromTranslation(roofMat, position);
        mat4.scale(roofMat, roofMat, [config.castleWidth * 0.75, config.castleLength * 0.75, 1]);
        mat4.rotateZ(roofMat, roofMat, Math.PI / 4);
        roof.setBaseModelMatrix(roofMat);

        this.addChild(roof);
    }
}
