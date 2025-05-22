<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { type Unsubscriber, derived, get } from 'svelte/store';
  import arrowCreate from 'arrows-svg';
  import { onMount } from 'svelte';
  import { vectorArrows } from './AxesFilterVector';
  import StaticConfiguration from '../../../../StaticConfiguration';
  import type { Axis } from '../../../../lib/domain/Axis';
  import { stores } from '../../../../lib/stores/Stores';
  import StandardButton from '../../../ui/buttons/StandardButton.svelte';
  import { knnCurrentPoint } from '../../../../lib/stores/KNNStores';

  const classifier = stores.getClassifier();

  const highlightedAxis = stores.getHighlightedAxes();
  const availableAxes = stores.getAvailableAxes();

  const drawArrows = (fromId: string) => {
    get(vectorArrows).forEach(arr => arr.clear());
    const from = document.getElementById(fromId)!;
    if (!from) {
      return;
    }

    vectorArrows.update(newVal => {
      for (let i = 0; i < filters.count(); i++) {
        const to = document.getElementById('arrowTo' + i.toString());
        if (!to) {
          throw new Error("Cant draw arrow, no destination 'arrowTo" + i + "'");
        }
        newVal.push(
          arrowCreate({
            from,
            to,
          }),
        );
      }
      return newVal;
    });
    get(vectorArrows).forEach(arr => {
      document.body.appendChild(arr.node);
    });
  };

  const updateArrows = (axes: Axis[]) => {
    if (axes.length !== 1) {
      return;
    }
    const axis = axes[0];
    drawArrows(`from${axis.label}`);
  };

  $: liveFilteredAxesData = $knnCurrentPoint?.getValue() ?? [];

  let valueInterval: NodeJS.Timeout = setInterval(() => {}, 100);

  const init = () => {
    denit();
    setTimeout(
      () => {
        // We set a timeout to fix a graphical issue, that relates to the resizing of DOM elements
        updateArrows($highlightedAxis);
      },
      // We vary the timeout, because if no arrows exist, it must be the first render cycle which requres a bit more time (to avoid artifacts)
      $vectorArrows.length === 0 ? 1000 : 200,
    );
  };

  let unsubscribe: undefined | Unsubscriber = undefined;
  const denit = () => {
    $vectorArrows.forEach(arr => arr.clear());
    clearInterval(valueInterval);
  };

  onMount(() => {
    init();
    return () => {
      denit();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

  unsubscribe = derived([highlightedAxis, classifier], s => s).subscribe(s => {
    init();
  });

  const filters = classifier.getFilters();
</script>

<div class:hidden={!$classifier.model.isTrained && !$classifier.model.isTraining}>
  <div>
    {#if $highlightedAxis !== undefined}
      <div class="flex flex-row space-x-1">
        <div class="flex flex-col justify-evenly">
          {#each $availableAxes as axis}
            <div class="flex flex-row space-x-2" id="from{axis.label}">
              <StandardButton
                color={StaticConfiguration.graphColors[axis.index]}
                small
                outlined={$highlightedAxis.find(e => e.index === axis.index) ===
                  undefined}
                onClick={() => {
                  $highlightedAxis = [axis];
                }}>
                {axis.label}
              </StandardButton>
            </div>
          {/each}
        </div>
        {#if $highlightedAxis.length === 1}
          <div class="pl-28 flex flex-col justify-around">
            {#each $filters as filter, index}
              <p class="pl-1" id={`arrowTo${index}`}>{filter.getName()}</p>
            {/each}
          </div>
          <div class="flex flex-col justify-around">
            {#each $filters as _}
              <img
                src={'imgs/right_arrow_blue.svg'}
                alt="right arrow icon"
                width="20px" />
            {/each}
          </div>
          <div class="flex flex-col justify-around w-12">
            {#each liveFilteredAxesData as val, index}
              <p style={`color:${StaticConfiguration.graphColors[index]}`}>
                {val.toFixed(2)}
              </p>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
