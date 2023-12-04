<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import ImageSkeleton from '../../components/skeletonloading/ImageSkeleton.svelte';
</script>

<p class="text-lg mb-2 font-semibold">{$t('content.index.newzHeading')}</p>
<p>
  {$t('content.index.newzBodyMakecode')}
</p>
<div class="flex justify-center">
  <ImageSkeleton
    alt="microbit guide"
    height={200}
    src="/imgs/Makecode_integration.png"
    width={200} />
</div>
<p class="mt-4 mb-5">
  <a class="text-link hover:underline" href="/training/filters"
    >{$t('content.index.newzBodyViz')}</a>
</p>
<div class="flex justify-center">
  <ImageSkeleton
    alt="One of the new visualizations"
    height={200}
    src="/imgs/data_rep_viz.png"
    width={250} />
</div>
