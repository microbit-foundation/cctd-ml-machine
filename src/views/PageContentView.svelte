<script lang="ts">
  import { currentComponent } from '../script/navigation/Navigation';
</script>

<div class="absolute -z-1 bottom-2 right-1">
  <img alt="theme graphic" src="imgs/arrow_group.svg" width="350px" />
</div>
<svelte:component this={$currentComponent} />
