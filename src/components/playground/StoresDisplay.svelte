<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import {
    classifier,
    liveAccelerometerData,
    gestures,
    engine,
  } from '../../script/stores/Stores';
  import PlaygroundGestureView from './PlaygroundGestureView.svelte';

  const model = classifier.getModel();
</script>

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
