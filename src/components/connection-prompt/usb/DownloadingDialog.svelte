<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../../i18n';

  export let transferProgress: number;
  $: transferProgressLabel = `${Math.round(transferProgress * 100)}%`;
</script>

<main>
  <div class="w-600px text-center">
    <h1 class="font-bold mb-8">
      {$t('connectMB.usb.header')}
    </h1>
    <p class="font-bold mb-2">
      {$t('connectMB.usb.pleaseWait')}
    </p>
    <div class="flex justify-center mb-2">
      <div class="flex-1 mr-2">
        <div class="w-full h-2 bg-gray-200 rounded">
          <div
            class="h-2 bg-secondary rounded"
            style="width: {transferProgress * 100}%;" />
        </div>
        <p class="text-left mt-1">
          {transferProgressLabel}
        </p>
      </div>
    </div>
  </div>
</main>
