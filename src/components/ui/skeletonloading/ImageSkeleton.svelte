<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<!-- 
  Skeleton loader takes a size and image, and will 'reserve' the given size on the page for the image, 
  and will fill it will a generic 'loading' animation until the image loads, at which point will be replaced 

  If you are unsure how much space should be allocated before-hand I recommend using dev-tools to inspect the image on the page,
  then take it's dimension and use it as parameters. 
  This doesn't account for smaller or larger screens, but is a good enough heuristic.
-->
<script lang="ts">
  import Skeleton from 'svelte-skeleton/Skeleton.svelte';

  export let alt: string;
  export let src: string;
  export let width: number | undefined = undefined;
  export let height: number | undefined = undefined;
  export let spin = false;
  export let castShadow = false;
  export let loadingColorPrimary: string | undefined = undefined;
  export let loadingColorSecondary: string | undefined = undefined;
  export let onLoaded: (() => void) | undefined = undefined;
  let hasLoaded = false;

  const onLoad = () => {
    if (onLoaded) {
      onLoaded();
    }
    hasLoaded = true;
  };
</script>

<img
  {alt}
  class:animate-duration-[10s]={spin}
  class:animate-spin={spin}
  class:hidden={!hasLoaded}
  class:shadow-md={castShadow}
  class="h-[{height}px]"
  {height}
  on:load={onLoad}
  {src}
  {width} />

{#if !hasLoaded}
  <div>
    <Skeleton
      {height}
      {width}
      primaryColor={loadingColorPrimary}
      secondaryColor={loadingColorSecondary} />
  </div>
{/if}
