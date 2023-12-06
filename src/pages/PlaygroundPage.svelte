<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import Gesture from '../script/domain/Gesture';
  import Model from '../script/domain/Model';
  import LayersModelTrainer from '../script/mlmodels/LayersModelTrainer';
  import {
    classifier,
    engine,
    gestures,
    liveAccelerometerData,
  } from '../script/stores/Stores';
  import AccelerometerClassifierInput from '../script/mlmodels/AccelerometerClassifierInput';
  import PlaygroundGestureView from '../components/playground/PlaygroundGestureView.svelte';
  import playgroundContext from '../components/playground/PlaygroundContext';
  import PlaygroundLog from '../components/playground/PlaygroundLog.svelte';
  import MicrobitAccelerometerDataSynthesizer from '../components/playground/inputSynthesizer/MicrobitAccelerometerDataSynthesizer.svelte';
  import LiveDataBufferUtilizationPercentage from '../components/playground/LiveDataBufferUtilizationPercentage.svelte';

  const getRandomGesture = (): Gesture => {
    return gestures.getGestures()[
      Math.floor(Math.random() * gestures.getNumberOfGestures())
    ];
  };

  const model: Model = classifier.getModel();
  const trainModelButtonClicked = () => {
    playgroundContext.addMessage('training model...');
    model
      .train(
        new LayersModelTrainer({
          noOfEpochs: 80,
        }),
      )
      .then(() => {
        playgroundContext.addMessage('Finished training!');
      });
  };

  const predictButtonClicked = () => {
    const randGesture = getRandomGesture();
    playgroundContext.addMessage(
      'Predicting on random recording of: ' + randGesture.getName(),
    );
    const input = new AccelerometerClassifierInput(randGesture.getRecordings()[0].data);
    classifier.classify(input).then(() => {
      playgroundContext.addMessage('Finished predicting');
    });
  };
</script>

<div class="flex flex-col p-5">
  <div class="flex">
    <div class="flex flex-col flex-shrink">
      <div>
        <p class="text-2xl mt-2">Model store</p>
        <p class="whitespace-pre">
          {JSON.stringify($model, null, 2).substring(
            2,
            JSON.stringify($model, null, 2).length - 1,
          )}
        </p>
      </div>
      <div>
        <p class="text-2xl mt-2">Classifier store</p>
        <p class="whitespace-pre">
          {JSON.stringify($classifier, null, 2).substring(
            2,
            JSON.stringify($classifier, null, 2).length - 1,
          )}
        </p>
      </div>
      <div>
        <p class="text-2xl mt-2">Engine store</p>
        <p class="whitespace-pre">
          {JSON.stringify($engine, null, 2).substring(
            2,
            JSON.stringify($engine, null, 2).length - 1,
          )}
        </p>
      </div>
      <div>
        <p class="text-2xl mt-2">LiveData store</p>
        <p class="whitespace-pre">
          {JSON.stringify($liveAccelerometerData, null, 2).substring(
            2,
            JSON.stringify($liveAccelerometerData, null, 2).length - 1,
          )}
        </p>
      </div>
      <div>
        <p class="text-2xl mt-2">Gestures (without recordings/output)</p>
        {#each $gestures as { ID }}
          <PlaygroundGestureView gesture={gestures.getGesture(ID)} />
        {/each}
      </div>
    </div>
    <div class="flex-grow" />
    <div class="flex flex-col w-100">
      <button class="border-1 p-2 m-1" on:click={trainModelButtonClicked}
        >train model!</button>
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
      <PlaygroundLog />
    </div>
  </div>
  <MicrobitAccelerometerDataSynthesizer />
  <LiveDataBufferUtilizationPercentage />
</div>
