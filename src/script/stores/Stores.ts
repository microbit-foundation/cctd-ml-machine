/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Repositories from "../domain/Repositories";
import Classifier from "../domain/stores/Classifier";
import Engine from "../domain/stores/Engine";
import LiveData from "../domain/stores/LiveData";
import { LiveDataVector } from "../domain/stores/LiveDataVector";
import Gestures from "../domain/stores/gesture/Gestures";
import PollingPredictorEngine from "../engine/PollingPredictorEngine";
import LocalStorageRepositories from "../repository/LocalStorageRepositories";

/**
 * Stores is a container object, that allows for management of global stores.
 */
class Stores {

    private liveData: LiveData<LiveDataVector> | undefined;
    private engine: Engine | undefined;
    private classifier: Classifier;
    private gestures: Gestures;

    public constructor() {
        this.liveData = undefined;
        this.engine = undefined;
        const repositories: Repositories = new LocalStorageRepositories();
        this.classifier = repositories.getClassifierRepository().getClassifier();
        this.gestures = new Gestures(repositories.getGestureRepository());
    }

    public getLiveData(): LiveData<LiveDataVector> {
        if (!this.liveData) {
            throw new Error("Cannot get liveData store. You must initialize it using setLiveData(...)")
        }
        return this.liveData;
    }

    public setLiveData<T extends LiveData<LiveDataVector>>(liveDataStore: T): T {
        if (!liveDataStore) {
            throw new Error("Cannot set live data store to undefined/null");
        }
        this.liveData = liveDataStore;
        this.engine = new PollingPredictorEngine(this.classifier, this.liveData);
        return this.liveData as T;
    }

    public getClassifier(): Classifier {
        return this.classifier;
    }

    public getGestures(): Gestures {
        return this.gestures;
    }

    public getEngine(): Engine {
        if (!this.engine) {
            throw new Error("Cannot get engine store, the liveData store has not been set. You must set it using setLiveData(...)")
        }
        return this.engine;
    }
}

export const stores = new Stores();