<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import GestureCard from '../../components/ui/Card.svelte';
  import GestureDot from '../../components/ui/GestureDot.svelte';
  import type Gesture from '../../lib/domain/stores/gesture/Gesture';

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
    <div class="absolute top-3 left-3">
      <GestureDot {gesture} />
    </div>
  </div>
</GestureCard>
