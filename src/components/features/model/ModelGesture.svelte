<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import type { AbstractState } from '../../../backend/statemanagement/AbstractState';
  import type { Confidences } from '../../../core/entities/Confidences';
  import type { NewGesture } from '../../../core/entities/NewGesture';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import OutputGestureStack from './ModelGestureStack.svelte';
  import OutputGestureTile from './ModelGestureTile.svelte';

  const gestureController = getControllers().getGestureController();
  const confidences: AbstractState<Confidences> = gestureController.getConfidences();
  export let gesture: AbstractState<NewGesture>;
  let wasTriggered = false;

  $: {
    let isConfident = $confidences.isConfident($gesture);
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
      Microbits.sendUARTGestureMessageToOutput($gesture.getName());
      return;
    }
  };

  export let variant: 'stack' | 'tile';
  export let onUserInteraction: () => void = () => {
    return;
  };
</script>

{#if variant === 'stack'}
  <OutputGestureStack gestureId={$gesture.getID()} {onUserInteraction} />
{/if}

{#if variant === 'tile'}
  <OutputGestureTile {gesture} />
{/if}
