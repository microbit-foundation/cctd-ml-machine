<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import Model from '../../script/domain/Model';
  import KNNModelTrainer from '../../script/mlmodels/KNNModelTrainer';
  import { classifier } from '../../script/stores/Stores';
  import playgroundContext from './PlaygroundContext';

  const model: Model = classifier.getModel();
  const trainModelButtonClicked = () => {
    playgroundContext.addMessage('training model...');
    const k = 10;
    model.train(new KNNModelTrainer(k)).then(() => {
      playgroundContext.addMessage('Finished training a KNN model (k=10)!');
    });
  };
</script>

<button class="border-1 p-2 m-1" on:click={trainModelButtonClicked}>
  train KNN model!
</button>
