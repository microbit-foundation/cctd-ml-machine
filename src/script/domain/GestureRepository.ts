import { Readable } from "svelte/store";
import Gesture, { GestureID } from "./Gesture";
import { PersistantGestureData } from "./Gestures";

interface GestureRepository extends Readable<Gesture[]> {
    getGesture(gestureId: GestureID): Gesture;

    clearGestures(): void;

    addGesture(gestureData: PersistantGestureData): Gesture;

    removeGesture(gestureId: number): void;
}

export default GestureRepository;