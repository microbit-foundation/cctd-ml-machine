<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import CookieManager from '../../script/CookieManager';
  import Gestures from '../../script/Gestures';
  import ConnectionBehaviours from '../../script/connection-behaviours/ConnectionBehaviours';
  import Microbits from '../../script/microbit-interfacing/Microbits';
  import { GestureData } from '../../script/stores/mlStore';
  import { state } from '../../script/stores/uiStore';
  import OutputGestureStack from './OutputGestureStack.svelte';
  import OutputGestureTile from './OutputGestureTile.svelte';

  export let gesture: GestureData;
  let wasTriggered = false;

  const confidence = Gestures.getConfidence(gesture.ID);
  const requiredConfidence = Gestures.getRequiredConfidence(gesture.ID);

  $: currentConfidence = $state.isInputReady ? $confidence : 0;

  $: {
    console.log($requiredConfidence);
  }

  $: {
    let isConfident = $requiredConfidence <= currentConfidence * 100;
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
  const wasTurnedOff = () => {
    // Some action here
    console.log('was turned off' + gesture.name);
  };
  const wasTurnedOn = () => {
    console.log('was turned on' + gesture.name);
    // TODO: Will be removed in the future - see https://github.com/microbit-foundation/cctd-ml-machine/issues/305 @amh
    if (CookieManager.hasFeatureFlag('mkcd')) {
      if (Microbits.isOutputMakecode()) {
        ConnectionBehaviours.getOutputBehaviour().onGestureRecognized(
          gesture.ID,
          gesture.name,
        );
        return;
      }
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
  <OutputGestureTile {confidence} {requiredConfidence} {gesture} />
{/if}
