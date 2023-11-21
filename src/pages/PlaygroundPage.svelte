<script lang="ts">
  import { mode } from 'd3';
  import Gesture from '../script/domain/Gesture';
  import Model from '../script/domain/Model';
  import LayersModelTrainer from '../script/mlmodels/LayersModelTrainer';
  import { classifier, engine, gestures, liveData } from '../script/stores/Stores';
  import AccelerometerClassifierInput from '../script/mlmodels/AccelerometerClassifierInput';
  import { get } from 'svelte/store';

  const getRandomGesture = (): Gesture => {
    return gestures.getGestures()[
      Math.floor(Math.random() * gestures.getNumberOfGestures())
    ];
  };

  const model: Model = classifier.getModel();
  const trainModelButtonClicked = () => {
    model
      .train(
        new LayersModelTrainer({
          noOfEpochs: 80,
        }),
      )
      .then(() => {
        console.log('Finished training');
      });
  };
  const predictButtonClicked = () => {
    const randGesture = getRandomGesture();
    const input = new AccelerometerClassifierInput(randGesture.getRecordings()[0].data);
    console.log('predicting on gesture ', get(randGesture));
    classifier.classify(input);
  };
</script>

<div class="flex space-between p-5">
  <div>
    <div>
      <p class="text-2xl mt-2">Model store</p>
      <p class="whitespace-pre">{JSON.stringify($model, null, 2).substring(2, JSON.stringify($model, null, 2).length-1)}</p>
    </div>
    <div>
      <p class="text-2xl mt-2">Classifier store</p>
      <p class="whitespace-pre">{JSON.stringify($classifier, null, 2).substring(2, JSON.stringify($classifier, null, 2).length-1)}</p>
    </div>
    <div>
      <p class="text-2xl mt-2">Engine store</p>
      <p class="whitespace-pre">{JSON.stringify($engine, null, 2).substring(2, JSON.stringify($engine, null, 2).length-1)}</p>
    </div>
    <div>
      <p class="text-2xl mt-2">LiveData store</p>
      <p class="whitespace-pre">{JSON.stringify($liveData, null, 2).substring(2, JSON.stringify($liveData, null, 2).length-1)}</p>
    </div>
  </div>
  <div class="flex-grow"></div>
  <div class="flex flex-col">
    <button class="border-1 p-2 m-1" on:click={trainModelButtonClicked}
      >train model!</button>
    <button class="border-1 p-2 m-1" on:click={predictButtonClicked}
      >Predict random gesture!</button>
    <button class="border-1 p-2 m-1" on:click={() => engine.start()}
      >Start engine!</button>
    <button class="border-1 p-2 m-1" on:click={() => engine.stop()}>Stop engine!</button>
  </div>
</div>
