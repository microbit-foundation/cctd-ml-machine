<script lang="ts">
  import StandardDialog from '../../dialogs/StandardDialog.svelte';
  import { t } from '../../../i18n.js';
  import StandardButton from '../../StandardButton.svelte';

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
        class="underline text-red-500 hover:text-red-300">
        {$t('content.index.contactMail')}
      </a>
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
