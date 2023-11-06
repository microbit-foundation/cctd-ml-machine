import { Writable, derived, get, writable } from "svelte/store";
import StaticConfiguration from "../../StaticConfiguration";
import GestureConfidence from "./GestureConfidence";

class ModelRepository {
    private static confidences: Writable<Map<number, number>>;

    constructor() {
        const initialConfidence = new Map<number, number>();
        ModelRepository.confidences = writable(initialConfidence);
    }

    /*
    TODO: Should be private. Once a model store is created, this should only be handled by that store.
    */
    public setGestureConfidence(gestureId: number, confidence: number) {
        if (confidence < 0 || confidence > 1) {
            throw new Error("Cannot set gesture confidence. Must be in the range 0.0-1.0")
        }
        const newConfidences = get(ModelRepository.confidences);
        newConfidences.set(gestureId, confidence);
        ModelRepository.confidences.set(newConfidences);
    }

    public getGestureConfidence(gestureId: number): GestureConfidence {
        const derivedConfidence = derived([ModelRepository.confidences], stores => {
            const confidenceStore = stores[0];
            if (confidenceStore.has(gestureId)) {
                return confidenceStore.get(gestureId) as number;
            }
            return 0;
        })
        return new GestureConfidence(StaticConfiguration.defaultRequiredConfidence, derivedConfidence)
    }
}

export default ModelRepository;