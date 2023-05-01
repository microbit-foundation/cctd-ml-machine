<style>
  main:hover > div > i {
    color: rgb(75, 85, 99) !important;
  }
</style>

<script lang="ts">
  import { isReady } from '../script/stores/uiStore';
  import { addGesture } from '../script/stores/mlStore';
  import { t } from '../i18n';

  const defaultNewName = $t('content.data.classPlaceholderNewClass');

  function onClick() {
    if (!isReady(false)) {
      return;
    }
    addGesture(defaultNewName);
  }
</script>

<main
  class="h-30 relative cursor-pointer transition ease w-72 items-center flex mb-2
	     p-2 bg-white bg-gradient-to-r from-white to-backgrounddark rounded-xl"
  on:click={onClick}>
  <div class="w-32 text-center">
    <i class="fas fa-plus fa-3x text-black-500 transition ease" />
  </div>
</main>
