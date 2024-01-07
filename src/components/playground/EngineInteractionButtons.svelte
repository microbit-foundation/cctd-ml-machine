<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import Gesture from '../../script/domain/Gesture';
  import AccelerometerClassifierInput from '../../script/mlmodels/AccelerometerClassifierInput';
  import { classifier, engine, gestures } from '../../script/stores/Stores';
  import playgroundContext from './PlaygroundContext';
  import TrainKnnModelButton from './TrainKNNModelButton.svelte';
  import TrainLayersModelButton from './TrainLayersModelButton.svelte';

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
    const xs = randGesture.getRecordings()[0].data.x;
    const ys = randGesture.getRecordings()[0].data.y;
    const zs = randGesture.getRecordings()[0].data.z;
    const input = new AccelerometerClassifierInput(xs, ys, zs);
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
