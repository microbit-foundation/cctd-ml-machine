<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../i18n';
  import { stores } from '../script/stores/Stores';

  const gestures = stores.getGestures();

  // Count of amount of recordings
  $: numberOfRecodings = $gestures.reduce(
    (sum, val) => (sum += val.recordings.length),
    0,
  );
</script>

<div class="w-full text-center justify-center pt-5 pb-7">
  <p class="text-7xl mb-4">{numberOfRecodings}</p>
  <p class="text-xl">{$t('menu.data.examples')}</p>
</div>
