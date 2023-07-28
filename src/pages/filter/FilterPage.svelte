<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import FilterToggler from './FilterToggler.svelte';
  import { FilterType, Filters } from '../../script/datafunctions';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
  import BaseDialog from '../../components/dialogs/BaseDialog.svelte';
  import FilterInspector from './FilterInspector.svelte';

  let isFilterInspectorDialogOpen = false;
  let currentFilter: FilterType | undefined = undefined;

  const openFilterInspector = (filter: FilterType) => {
    currentFilter = filter;
    isFilterInspectorDialogOpen = true;
  };
</script>

<div>
  <BaseDialog
    isOpen={isFilterInspectorDialogOpen}
    onClose={() => {
      isFilterInspectorDialogOpen = false;
    }}>
    <FilterInspector
      filter={currentFilter}
      onClose={() => {
        isFilterInspectorDialogOpen = false;
      }} />
  </BaseDialog>
  <ControlBar />
  <div class="p-5 grid grid-cols-2">
    {#each Object.values(Filters) as filter}
      <FilterToggler {filter} openInspector={openFilterInspector} />
    {/each}
  </div>
</div>
