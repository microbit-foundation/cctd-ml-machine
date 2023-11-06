<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import CookieManager from '../../script/CookieManager';
  import Gestures from '../../script/Gestures';
  import ConnectionBehaviours from '../../script/connection-behaviours/ConnectionBehaviours';
  import Microbits from '../../script/microbit-interfacing/Microbits';
    import Gesture from '../../script/stores/Gesture';
  import { GestureData } from '../../script/stores/mlStore';
  import { state } from '../../script/stores/uiStore';
  import OutputGestureStack from './OutputGestureStack.svelte';
  import OutputGestureTile from './OutputGestureTile.svelte';

  export let gesture: Gesture;
  let wasTriggered = false;

  const confidence = $gesture.confidence.currentConfidence;
  const requiredConfidence = $gesture.confidence.requiredConfidence;

  $: currentConfidence = $state.isInputReady ? confidence : 0;

  $: {
    console.log(requiredConfidence);
  }

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
      ConnectionBehaviours.getOutputBehaviour().onGestureRecognized(
        $gesture.ID,
        $gesture.name,
      );
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
  <OutputGestureTile gesture={gesture} />
{/if}
