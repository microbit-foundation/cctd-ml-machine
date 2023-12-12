<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import Gesture from '../../script/domain/Gesture';
  import { GestureData } from '../../script/stores/mlStore';

  export let gesture: Gesture;
  const reduceData = (gestureData: GestureData) => {
    const { recordings, output, ...reduced } = gestureData;
    return reduced;
  };
</script>

<div class="flex flex-row mb-1">
  <div class="mr-3">
    <p>Gesture: {$gesture.name}</p>
  </div>
  <p class="whitespace-pre border-1 border-solid">
    {JSON.stringify(reduceData($gesture), null, 2)}
  </p>
</div>
