<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import ImageSkeleton from '../../components/skeletonloading/ImageSkeleton.svelte';
</script>

<p class="text-lg mb-2 font-semibold">
  {$t('content.index.heading')}
</p>
<p>
  {$t('content.index.howBody')}
</p>
<div
  class="relative w-342px place-self-center flex justify-around gap-1 ml-auto mr-auto mt-6 mb-6">
  <div class="">
    <p class="absolute text-center w-60px left-5px top-12px">
      {$t('content.index.ledDescription')}
    </p>
    <div
      class="flex-col place-content-center drop-shadow-xl center-items content-center justify-items-center">
      <div>
        <ImageSkeleton
          alt="microbit guide"
          height={114}
          src="/imgs/microbit_guide.svg"
          width={200} />
      </div>
    </div>
    <p class="absolute text-center w-60px right-0px top-30px">
      {$t('content.index.recordButtonDescription')}
    </p>
  </div>
</div>
<p>
  {$t('content.index.setupBody2')}
</p>
<br />
<p>
  {$t('content.index.oldVersion')}
  <a class="text-link hover:underline" href="https://www.v0.ml-machine.org/">
    v0.ml-machine.org
  </a>
</p>
