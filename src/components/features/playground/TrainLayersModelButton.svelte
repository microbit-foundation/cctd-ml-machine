<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import Model from '../../lib/domain/stores/Model';
  import LayersModelTrainer from '../../lib/mlmodels/LayersModelTrainer';
  import { stores } from '../../lib/stores/Stores';
  import playgroundContext from './PlaygroundContext';

  const classifier = stores.getClassifier();
  const model: Model = classifier.getModel();

  const trainModelButtonClicked = () => {
    playgroundContext.addMessage('training model...');
    model
      .train(
        new LayersModelTrainer(
          StaticConfiguration.defaultNeuralNetworkSettings,
          () => {},
        ),
      )
      .then(() => {
        playgroundContext.addMessage('Finished training!');
      });
  };
</script>

<button class="border-1 p-2 m-1" on:click={trainModelButtonClicked}
  >train layers model!</button>
