<script lang="ts">
  import { onMount } from 'svelte';
  import StandardDialog from './dialogs/StandardDialog.svelte';
  import TypingUtils from '../script/TypingUtils';

  const pingDestination = 'https://ml-machine.org/favicon.png';

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
  const checkConnection = () => {
    const img = new Image();
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
    }, 3000);
  };

  onMount(() => {
    animateDots();
    checkConnection();
  });

  let isOpen = true;
</script>

{#if !connectionOk}
  <StandardDialog {isOpen} onClose={() => (isOpen = false)}>
    <div class="w-80">
      <p class="text-warning font-bold text-center text-lg">Connection offline</p>
      <p class="text-primarytext text-left">
        Your internet connection is offline, some features may not work properly
      </p>
      <p>{animatedDots}</p>
    </div>
  </StandardDialog>
{/if}
