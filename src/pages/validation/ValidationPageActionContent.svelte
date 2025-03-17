<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
    import { onMount } from 'svelte';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
    import BaseVector from '../../script/domain/BaseVector';
    import { ClassifierInput } from '../../script/domain/ClassifierInput';
  import type { ValidationSet } from '../../script/domain/ValidationSet';
  import { stores } from '../../script/stores/Stores';

  const gestures = stores.getGestures();
  const validationSets = stores.getValidationSets();
  const classifier = stores.getClassifier();
  const model = classifier.getModel();
  const filters = classifier.getFilters();
  $: gestureIds = $gestures.map(gesture => gesture.ID);

  const v = async () => {
    $validationSets.map(e => {
      return e.recordings.map(async r => {
        const recordingSamples = r.samples.map(v => new BaseVector(v.vector))
        const classifierInput = new ClassifierInput(recordingSamples)
        const x = await model.predict(new BaseVector(classifierInput.getInput(filters)))
        console.log(x)
      });
    });
  };

  onMount(() => {
    v();
  })
</script>

<div class="bg-white h-full flex flex-row">
  <div class="pl-2 flex flex-col justify-center">
    <StandardButton>Test</StandardButton>
  </div>
  <div class="flex flex-col justify-center">
    <table>
      <thead>
        <tr>
          {#each $gestures as gesture}
            <td>{gesture.name}</td>
          {/each}
        </tr>
      </thead>
      <tbody>
        <tr>
          {#each $gestures as gesture}
            <td>{gesture.name}</td>
          {/each}
        </tr>
        <tr>
          {#each $gestures as gesture}
            <td>{gesture.name}</td>
          {/each}
        </tr>
      </tbody>
    </table>
  </div>
</div>
