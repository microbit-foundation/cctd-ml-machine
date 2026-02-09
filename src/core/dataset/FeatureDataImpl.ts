import type { Vector } from "../vector/Vector";
import type { FeatureData } from "./FeatureData";

export class FeatureDataImpl implements FeatureData {
    constructor(private features: Vector) { }

    getFeatures(): Vector {
        return this.features;
    }
}

