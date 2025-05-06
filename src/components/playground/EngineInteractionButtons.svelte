<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import BaseLiveDataVector from '../../lib/domain/BaseLiveDataVector';
  import BaseVector from '../../lib/domain/BaseVector';
  import { ClassifierInput } from '../../lib/domain/ClassifierInput';
  import Gesture from '../../lib/domain/stores/gesture/Gesture';
  import { stores } from '../../lib/stores/Stores';
  import playgroundContext from './PlaygroundContext';
  import TrainKnnModelButton from './TrainKNNModelButton.svelte';
  import TrainLayersModelButton from './TrainLayersModelButton.svelte';

  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();
  const engine = stores.getEngine();

  const getRandomGesture = (): Gesture => {
    return gestures.getGestures()[
      Math.floor(Math.random() * gestures.getNumberOfGestures())
    ];
  };

  const predictButtonClicked = () => {
    const randGesture = getRandomGesture();
    playgroundContext.addMessage(
      'Predicting on random recording of: ' + randGesture.getName(),
    );
    const xs = randGesture.getRecordings()[0].samples.map(e => e.vector[0]);
    const ys = randGesture.getRecordings()[0].samples.map(e => e.vector[1]);
    const zs = randGesture.getRecordings()[0].samples.map(e => e.vector[2]);

    const labels = randGesture.getRecordings()[0].labels;
    const bufferedData = randGesture.getRecordings()[0].samples.map(e => e.vector);

    const sampleVectors = bufferedData
      .map(e => new BaseVector(e))
      .map(e => new BaseLiveDataVector(e, labels));

    const input = new ClassifierInput(sampleVectors);
    classifier.classify(input).then(() => {
      playgroundContext.addMessage('Finished predicting');
    });
  };
</script>

<TrainLayersModelButton />
<TrainKnnModelButton />
<button class="border-1 p-2 m-1" on:click={predictButtonClicked}
  >Predict random gesture!</button>
<button
  class="border-1 p-2 m-1"
  on:click={() => {
    playgroundContext.addMessage('Starting engine');
    engine.start();
  }}>Start engine!</button>
<button
  class="border-1 p-2 m-1"
  on:click={() => {
    playgroundContext.addMessage('Stopping engine');
    engine.stop();
  }}>Stop engine!</button>
