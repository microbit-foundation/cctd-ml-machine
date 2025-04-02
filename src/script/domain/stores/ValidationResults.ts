/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable, type Invalidator, type Readable, type Subscriber, type Unsubscriber, type Writable } from "svelte/store";
import type ValidationSets from "./ValidationSets";
import type Filters from "../Filters";
import type Classifier from "./Classifier";
import BaseVector from "../BaseVector";
import { ClassifierInput } from "../ClassifierInput";
import { findLargestIndex } from "../../utils/Math";

export type ValidationResult = { prediction: number[]; gestureIdx: number }[][];
class ValidationResults implements Readable<ValidationResult> {

    private store: Writable<ValidationResult>;

    public constructor(private validationSets: ValidationSets, private classifier: Classifier) {
        this.store = writable([]);
    }

    public subscribe(run: Subscriber<ValidationResult>, invalidate?: Invalidator<ValidationResult> | undefined): Unsubscriber {
        return this.store.subscribe(run, invalidate);
    }

    public async evaluateValidationSet() {
        const filters = this.classifier.getFilters();
        const setEvaluations = get(this.validationSets).map(async set => {
            const recordingEvaluations = set.recordings.map(async rec => {
                const samples = rec.samples.map(sample => new BaseVector(sample.vector));
                const classifierInput = new ClassifierInput(samples);
                return await this.classifier.getModel().predict(new BaseVector(classifierInput.getInput(filters)));
            });

            const predictions = await Promise.all(recordingEvaluations);

            return predictions.map(pred => ({
                gestureIdx: findLargestIndex(pred),
                prediction: pred,
            }));
        });
        const evaluations =  await Promise.all(setEvaluations);
        this.store.set(evaluations);
    };
}

export default ValidationResults;