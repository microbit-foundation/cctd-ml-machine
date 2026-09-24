<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import type { AbstractState } from '../../backend/statemanagement/AbstractState';
  import GestureCard from '../components/Card.svelte';
  import GestureDot from '../components/GestureDot.svelte';
  import type { GestureID } from '../../core/entities/Gesture';
  import type { NewGesture } from '../../core/entities/NewGesture';

  export let gestureId: GestureID;
  const gesture: AbstractState<NewGesture> = getControllers()
    .getGestureController()
    .getGestureState(gestureId);
</script>

<GestureCard validationPage small>
  <div class="self-center px-4 flex flex-col h-full relative justify-center">
    <div>
      <div
        class="flex-grow text-center font-semibold rounded-xl border bg-white bg-opacity-85 border-primaryborderaccent border-solid px-4">
        <p>{$gesture.getName()}</p>
      </div>
    </div>
    <!-- DOT -->
    <div class="absolute top-3 left-3">
      <GestureDot gesture={$gesture} />
    </div>
  </div>
</GestureCard>
