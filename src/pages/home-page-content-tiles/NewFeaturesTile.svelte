<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import ImageSkeleton from '../../components/ui/skeletonloading/ImageSkeleton.svelte';
</script>

<p class="text-lg mb-2 font-semibold">{$t('content.index.newzHeading')}</p>
<p>
  {$t('content.index.newzBodyMakecode')}
</p>
<br />
<div class="flex justify-center">
  <ImageSkeleton
    alt="One of the new visualizations"
    src="/imgs/math_version.png"
    width={350} />
</div>
<br />
<p>
  {$t('content.index.mathVersion')}
  <a class="text-link hover:underline" href="https://www.math.ml-machine.org/">
    math.ml-machine.org
  </a>
</p>
