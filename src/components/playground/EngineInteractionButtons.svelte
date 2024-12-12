<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { ClassifierInput } from '../../script/domain/ClassifierInput';
  import Gesture from '../../script/domain/stores/gesture/Gesture';
  import BaseVector from '../../script/domain/BaseVector';
  import { stores } from '../../script/stores/Stores';
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
    const input = new ClassifierInput(
      randGesture
        .getRecordings()[0]
        .samples.map(
          e => new BaseVector(e.vector, randGesture.getRecordings()[0].labels),
        ),
    );
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
