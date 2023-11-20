<script lang="ts">
    import { mode } from 'd3';
    import Gesture from '../script/domain/Gesture';
  import Model from '../script/domain/Model';
  import LayersModelTrainer from '../script/mlmodels/LayersModelTrainer';
  import { classifier, gestures } from '../script/stores/Stores';
    import AccelerometerClassifierInput from '../script/mlmodels/AccelerometerClassifierInput';
    import { get } from 'svelte/store';

  const getRandomGesture = (): Gesture => {
    return gestures.getGestures()[Math.floor(Math.random() * gestures.getNumberOfGestures())]
  }

  const model: Model = classifier.getModel();
  const trainModelButtonClicked = () => {
    model
      .train(
        new LayersModelTrainer({
          noOfEpochs: 80,
        }),
      )
      .then(() => {
        console.log("Finished training");
      });
  };
  const predictButtonClicked = () => {
    const randGesture = getRandomGesture();
    const input = new AccelerometerClassifierInput(randGesture.getRecordings()[0].data);
    console.log("predicting on gesture ", get(randGesture))
    classifier.classify(input)
  };

</script>

<div class="p-8">
<div>
  <p class="text-2xl">Model store</p>
  <p class="whitespace-pre">{JSON.stringify($model, null, 2)}</p>
</div>
<div>
  <p class="text-2xl">Classifier store</p>
  <p class="whitespace-pre">{JSON.stringify($classifier, null, 2)}</p>
</div>
<button class="border-1 p-2 m-1" on:click={trainModelButtonClicked}>train model!</button>
<button class="border-1 p-2 m-1" on:click={predictButtonClicked}
  >Predict random gesture!</button>
</div>