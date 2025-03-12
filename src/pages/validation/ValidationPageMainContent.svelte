<script lang="ts">
  import RecordInformationContent from '../../components/datacollection/RecordInformationContent.svelte';
  import Information from '../../components/information/Information.svelte';
  import { stores } from '../../script/stores/Stores';
  import { hasSomeData } from '../data/DataPage';
  import ValidationGestureNameCard from './ValidationGestureNameCard.svelte';
  import { t } from '../../i18n';

  const gestures = stores.getGestures();
</script>

<div class="p-4 gap-2 grid grid-cols-[max(200px,20%)_140px_1fr]">
  <div class="left-3 flex col-start-1">
    <Information
      isLightTheme={false}
      iconText={"translate-!!-"+ $t('content.data.classification')}
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

  {#each $gestures as gesture}
    <div class="col-start-1">
      <ValidationGestureNameCard gesture={gestures.getGesture(gesture.ID)} />
    </div>
  {/each}
</div>
