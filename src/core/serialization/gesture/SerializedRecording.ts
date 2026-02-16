import type { Axis } from "../../entities/Axis";
import type { SerializedSample } from "./SerializedSample";

export interface SerializedRecording {
    ID: number;
    samples: SerializedSample[];
    axes: Axis[];
}