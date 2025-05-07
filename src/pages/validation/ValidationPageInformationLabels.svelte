<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import RecordInformationContent from '../../components/features/datacollection/RecordInformationContent.svelte';
  import Information from '../../components/ui/information/Information.svelte';
  import { t } from '../../i18n';
  import { hasSomeRecordingData } from '../data/DataPage';
</script>

<!-- Layout based on parent display:grid container -->
<div class="left-3 flex col-start-1">
  <Information
    isLightTheme={false}
    iconText={$t('content.data.classification')}
    titleText={$t('content.data.classHelpHeader')}
    bodyText={$t('content.validation.infobox.classesContent')} />
</div>

<div class="left-60 flex col-start-2">
  <Information isLightTheme={false} iconText={$t('content.data.choice')}>
    <RecordInformationContent isLightTheme={false} />
  </Information>
</div>

{#if $hasSomeRecordingData}
  <div class="left-92 flex col-start-3">
    <Information
      isLightTheme={false}
      iconText={$t('content.data.data')}
      titleText={$t('content.data.data')}
      bodyText={$t('content.data.dataDescription')} />
  </div>
{/if}
