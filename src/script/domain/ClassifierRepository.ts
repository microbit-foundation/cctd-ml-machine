import Classifier from "./Classifier";
import GestureConfidence from "./GestureConfidence";

interface ClassifierRepository {
    getClassifier(): Classifier;

    // TODO: I'm not entirely sure if this is appropriate
    getGestureConfidence(gestureId: number): GestureConfidence;
}

export default ClassifierRepository;