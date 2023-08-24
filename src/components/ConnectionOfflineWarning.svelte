<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import StandardDialog from './dialogs/StandardDialog.svelte';
  import TypingUtils from '../script/TypingUtils';
  import { t } from '../i18n.js';
  import StaticConfiguration from '../StaticConfiguration';

  /*
  Connection check works like this:
  1 - Create image component
  2 - Set favicon into it as src
  3 - Use onerror and onload to determine whether or not it was successfully loaded
   */
  const pingDestination = '/imgs/favicon.png';

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
      }, StaticConfiguration.connectionLostTimeoutDuration);
      return;
    };
    img.onerror = ev => {
      connectionOk = false;
      clearTimeout(connectionTimer);
      setTimeout(() => {
        checkConnection();
      }, StaticConfiguration.connectionLostTimeoutDuration);
      return;
    };

    img.src = pingDestination;

    connectionTimer = setTimeout(() => {
      connectionOk = false;
      checkConnection();
    }, StaticConfiguration.connectionLostTimeoutDuration);
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
