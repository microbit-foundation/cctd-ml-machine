<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardDialog from '../../dialogs/StandardDialog.svelte';
  import { t } from '../../../i18n';
  import StandardButton from '../../buttons/StandardButton.svelte';

  let isContactDialogOpen = false;
</script>

<div>
  <StandardDialog
    isOpen={isContactDialogOpen}
    onClose={() => (isContactDialogOpen = false)}>
    <p class="w-60">
      {$t('content.index.contactBody')}
      <a
        href={`mailto:${$t('content.index.contactMail')}`}
        class="text-red-500 hover:underline">
        {$t('content.index.contactMail')}
      </a>
    </p>
    <p class="w-60">
      {$t('content.index.contactBodyGithub')}
      <a
        class="text-link hover:underline"
        href="https://github.com/microbit-foundation/cctd-ml-machine">cctd-ml-mahine</a>
    </p>
  </StandardDialog>
  <StandardButton
    onClick={() => (isContactDialogOpen = !isContactDialogOpen)}
    small
    outlined
    bold={false}
    shadows={false}
    color={'primary'}>
    {$t('content.index.contactButton')}
  </StandardButton>
</div>
