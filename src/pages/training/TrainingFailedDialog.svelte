<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import StandardDialog from '../../components/ui/dialogs/StandardDialog.svelte';
  import { slide } from 'svelte/transition';

  import { TrainingStatus } from '../../lib/domain/stores/Model';
  import { stores } from '../../lib/stores/Stores';

  let isFailedTrainingDialogOpen = false;

  const model = stores.getClassifier().getModel();

  $: {
    if ($model.trainingStatus === TrainingStatus.Failure) {
      isFailedTrainingDialogOpen = true;
      model.markAsUntrained();
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
