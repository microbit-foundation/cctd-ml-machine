import { writable } from "svelte/store";
import type { IVector as IVector } from "../../../script/domain/IVector";

export interface KNNGraphPoints {
    livePoint?: IVector
    trainingPoints: IVector[]
}

export const knnGraphPointsStore = writable<KNNGraphPoints>({
    livePoint: undefined,
    trainingPoints: []
})