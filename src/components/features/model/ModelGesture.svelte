<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import type Gesture from '../../../lib/domain/stores/gesture/Gesture';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import OutputGestureStack from './ModelGestureStack.svelte';
  import OutputGestureTile from './ModelGestureTile.svelte';

  export let gesture: Gesture;
  let wasTriggered = false;

  $: {
    let isConfident = $gesture.confidence.isConfident;
    if (isConfident) {
      if (!wasTriggered) {
        wasTurnedOn();
      }
      wasTriggered = true;
    } else {
      if (wasTriggered) {
        wasTurnedOff();
      }
      wasTriggered = false;
    }
  }
  const wasTurnedOff = () => {};
  const wasTurnedOn = () => {
    if (Microbits.isOutputMakecode()) {
      Microbits.sendUARTGestureMessageToOutput($gesture.name);
      return;
    }
  };

  export let variant: 'stack' | 'tile';
  export let onUserInteraction: () => void = () => {
    return;
  };
</script>

{#if variant === 'stack'}
  <OutputGestureStack {gesture} {onUserInteraction} />
{/if}

{#if variant === 'tile'}
  <OutputGestureTile {gesture} />
{/if}
