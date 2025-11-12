<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<style global windi:preflights:global windi:safelist:global>
  @keyframes textAni {
    0% {
      opacity: 0;
    }
    3% {
      opacity: 1;
    }
    97% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>

<script>
  import { MLMachine } from './backend/interface-adapter/MLMachine';
  import AppRoot from './frontend/view/AppRoot.svelte';
  new MLMachine().init();
</script>

<AppRoot />
