<script lang="ts">
  import RecordInformationContent from '../../components/datacollection/RecordInformationContent.svelte';
  import Information from '../../components/information/Information.svelte';
  import { t } from '../../i18n';
  import { hasSomeData } from '../data/DataPage';
</script>

<!-- Layout based on parent grid container -->
<div class="left-3 flex col-start-1">
  <Information
    isLightTheme={false}
    iconText={'translate-!!-' + $t('content.data.classification')}
    titleText={$t('content.data.classHelpHeader')}
    bodyText={$t('content.data.classHelpBody')} />
</div>

<div class="left-60 flex col-start-2">
  <Information isLightTheme={false} iconText={$t('content.data.choice')}>
    <RecordInformationContent isLightTheme={false} />
  </Information>
</div>

{#if $hasSomeData}
  <div class="left-92 flex col-start-3">
    <Information
      isLightTheme={false}
      iconText={$t('content.data.data')}
      titleText={$t('content.data.data')}
      bodyText={$t('content.data.dataDescription')} />
  </div>
{/if}
