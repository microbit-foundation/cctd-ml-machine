<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { Paths, navigate } from '../router/paths';
  import StandardButton from './StandardButton.svelte';
</script>

<StandardButton
  fillOnHover
  small
  outlined
  bold={false}
  shadows={false}
  color={'primary'}
  onClick={() => {
    navigate(Paths.PLAYGROUND);
  }}>
  Go to playground
</StandardButton>
