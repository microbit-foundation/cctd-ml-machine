<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import Gesture from '../../script/domain/Gesture';
  import Model from '../../script/domain/Model';
  import AccelerometerClassifierInput from '../../script/mlmodels/AccelerometerClassifierInput';
  import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
  import { classifier, engine, gestures } from '../../script/stores/Stores';
  import playgroundContext from './PlaygroundContext';

  const getRandomGesture = (): Gesture => {
    return gestures.getGestures()[
      Math.floor(Math.random() * gestures.getNumberOfGestures())
    ];
  };

  const model: Model = classifier.getModel();
  const trainModelButtonClicked = () => {
    playgroundContext.addMessage('training model...');
    model
      .train(new LayersModelTrainer(StaticConfiguration.layersModelTrainingSettings))
      .then(() => {
        playgroundContext.addMessage('Finished training!');
      });
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

<button class="border-1 p-2 m-1" on:click={trainModelButtonClicked}>train model!</button>
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
