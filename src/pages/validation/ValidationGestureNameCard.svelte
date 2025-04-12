<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import GestureCard from '../../components/GestureCard.svelte';
  import type Gesture from '../../script/domain/stores/gesture/Gesture';

  export let gesture: Gesture;
</script>

<GestureCard validationPage small>
  <div class="self-center px-4 flex flex-col h-full relative justify-center">
    <div>
      <div
        class="flex-grow text-center font-semibold rounded-xl border bg-white bg-opacity-85 border-primaryborderaccent border-solid px-4">
        <p>{$gesture.name}</p>
      </div>
    </div>
    <!-- DOT -->
    <div
      class="absolute rounded-full w-3 h-3 m-3 top-0 left-0"
      style={`background-color:${gesture.getColor()}`}>
    </div>
  </div>
</GestureCard>
