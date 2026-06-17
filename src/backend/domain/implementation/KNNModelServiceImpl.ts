import type { LabelledPoint } from "../../../core/model/KNN/LabelledPoint";
import type { DataService } from "../DataService";
import type { KNNModelService } from "../KNNModelService";

export class KNNModelServiceImpl implements KNNModelService {

    constructor(private dataService: DataService) { }

    getPoints(): LabelledPoint[] {
        const labels = this.dataService.getTrainingDataset().getLabels();
        const features = this.dataService.getTrainingDataset().getFeatureSet();
        const points: LabelledPoint[] = [];
        for (let i = 0; i < features.length; i++) {
            points.push({
                vector: features[i].getFeatures(),
                classIndex: labels.getIndexLabels()[i].getIndex()
            });
        }
        return points;
    }

}