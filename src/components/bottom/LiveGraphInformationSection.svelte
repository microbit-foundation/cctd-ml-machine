<script lang="ts">
  import { t } from '../../i18n';
  import { state } from '../../script/stores/uiStore';
  import TextInformation from '../information/TextInformation.svelte';
</script>

<div class="flex flex-row">
  <div>
    <TextInformation
      titleText={$t('footer.helpHeader')}
      bodyText={$t('footer.helpContent')}
      isLightTheme={false}
      boxOffset={{ x: 25, y: -150 }} />
  </div>
  <p class="float-left ml-10">Live</p>
  <p
    class="float-left ml-1 -mt-3 text-3xl"
    class:text-red-500={$state.isInputReady}
    class:text-gray-500={!$state.isInputReady}>
    &#x2022;
  </p>
</div>
