<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
</script>

<p class="text-lg mb-2 font-semibold">{$t('content.index.makecodeVideoHeading')}</p>
<p>{$t('content.index.makecodeVideoBody')}</p>
<br />
<div class="flex justify-center flex-grow">
  <div class="w-full flex flex-row justify-center">
    <iframe
      src="https://www.youtube.com/embed/4lHzYr017FI"
      referrerpolicy="strict-origin-when-cross-origin"
      title={$t('content.index.makecodeVideoIframeTitle')}
      class="w-full h-full w-116 h-66"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"></iframe>
  </div>
</div>
