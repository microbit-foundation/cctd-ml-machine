<script lang="ts">
  import { currentContentComponent } from '../script/navigation/ContentViewNavigator';
</script>

<div class="absolute -z-1 bottom-2 right-1">
  <img alt="theme graphic" src="imgs/arrow_group.svg" width="350px" />
</div>
<svelte:component this={$currentContentComponent} />
