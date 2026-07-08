<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import StandardDialog from '../../components/ui/dialogs/StandardDialog.svelte';
  import { slide } from 'svelte/transition';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';

  let isFailedTrainingDialogOpen = false;

  const classifierController = getControllers().getClassifierController();
  const modelTraining = classifierController.getModelTraining();

  $: {
    if ($modelTraining.getError()) {
      isFailedTrainingDialogOpen = true;
      classifierController.clearClassifier();
    }
  }
</script>

<StandardDialog
  isOpen={isFailedTrainingDialogOpen}
  onClose={() => (isFailedTrainingDialogOpen = false)}>
  <div
    class="justify-center items-center content-center w-150 bg-white m-auto"
    transition:slide>
    <div>
      <p class="text-warning font-bold text-center text-xl mb-5">
        {$t('content.trainer.failure.header')}
      </p>
      <p class="mb-3">
        {$t('content.trainer.failure.body')}
      </p>
      <p class="font-bold">
        {$t('content.trainer.failure.todo')}
      </p>
    </div>
  </div>
</StandardDialog>
