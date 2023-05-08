<script lang="ts">
  import { onMount } from 'svelte';
  import StandardDialog from './dialogs/StandardDialog.svelte';
  import TypingUtils from '../script/TypingUtils';
  import { t } from '../i18n.js';

  /*
  Connection check works like this:
  1 - Create image component
  2 - Set favicon into it as src
  3 - Use onerror and onload to determine whether or not it was successfully loaded
   */
  const pingDestination = 'https://ml-machine.org/favicon.png';

  const pingTimeoutTime = 1500; // How long should we attempt to load before considering it a failure?

  const getAnimatedDots = (numOfDots: number) => {
    return `•`.repeat(numOfDots);
  };

  const maxDots = 4;
  let numDots = 1;
  let animatedDots = getAnimatedDots(1);

  const animateDots = () => {
    setTimeout(() => {
      numDots++;
      numDots = numDots % maxDots;
      animatedDots = getAnimatedDots(numDots + 1);
      animateDots();
    }, 800);
  };

  let connectionTimer: NodeJS.Timeout = setTimeout(TypingUtils.emptyFunction);
  let connectionOk = true;

  let img = new Image();

  const checkConnection = () => {
    // Delete and recreate element to avoid memory leak
    img.remove();
    img = new Image();
    img.onload = () => {
      connectionOk = true;
      isOpen = true;
      clearTimeout(connectionTimer);
      setTimeout(() => {
        checkConnection();
      }, 3000);
      return;
    };
    img.onerror = ev => {
      // Errors do not indicate bad connection, just bad request/response, such as image do not exist
      connectionOk = false;
      clearTimeout(connectionTimer);
      setTimeout(() => {
        checkConnection();
      }, 3000);
      return;
    };

    img.src = pingDestination;

    connectionTimer = setTimeout(() => {
      connectionOk = false;
      checkConnection();
    }, pingTimeoutTime);
  };

  onMount(() => {
    animateDots();
    checkConnection();
  });

  let isOpen = true;
</script>

{#if !connectionOk}
  <StandardDialog {isOpen} onClose={() => (isOpen = false)}>
    <div class="w-100">
      <p class="text-warning font-bold text-center text-lg">
        {$t('dialog.connection.lost.header')}
      </p>
      <p class="text-primarytext text-left">
        {$t('dialog.connection.lost.body')}
      </p>
      <p>{animatedDots}</p>
    </div>
  </StandardDialog>
{/if}
