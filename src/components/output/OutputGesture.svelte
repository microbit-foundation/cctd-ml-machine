<script lang="ts">
  import { GestureData } from '../../script/stores/mlStore';
  import OutputGestureStack from './OutputGestureStack.svelte';
  import OutputGestureTile from './OutputGestureTile.svelte';

  export let variant: 'stack' | 'tile';
  export let onUserInteraction: () => void = () => {
    return;
  };
  export let gesture: GestureData;
</script>

{#if variant === 'stack'}
  <OutputGestureStack {gesture} {onUserInteraction} />
{/if}

{#if variant === 'tile'}
  <OutputGestureTile {gesture} />
{/if}
