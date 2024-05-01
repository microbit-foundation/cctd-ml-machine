<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { Readable, derived, get } from 'svelte/store';
  import { classifier, liveAccelerometerData } from '../../../script/stores/Stores';
  import StaticConfiguration from '../../../StaticConfiguration';
  import Axes from '../../../script/domain/Axes';
  import { extractAxisFromAccelerometerData } from '../../../script/utils/graphUtils';
  import StandardButton from '../../buttons/StandardButton.svelte';
  import { highlightedAxis } from '../../../script/stores/uiStore';
  import arrowCreate, { IArrow } from 'arrows-svg';
  import { afterUpdate, onMount } from 'svelte';
  import { vectorArrows } from './AxesFilterVector';

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

  const updateArrows = (axis: Axes | undefined) => {
    if (axis) {
      const getId = (): string => {
        if ($highlightedAxis === Axes.X) {
          return 'fromX';
        }
        if ($highlightedAxis === Axes.Y) {
          return 'fromY';
        }
        if ($highlightedAxis === Axes.Z) {
          return 'fromZ';
        }
        throw Error('This shouldnt happen');
      };
      drawArrows(getId());
    }
  };

  const getVectorValue = () => {
    if (!get(highlightedAxis)) {
      return Array(classifier.getFilters().count()).fill(0);
    }
    try {
      const seriesTimestamped = liveAccelerometerData
        .getBuffer()
        .getSeries(
          StaticConfiguration.pollingPredictionSampleDuration,
          StaticConfiguration.pollingPredictionSampleSize,
        );
      const series = seriesTimestamped.map(s => s.value);
      const filteredSeries = classifier
        .getFilters()
        .compute(extractAxisFromAccelerometerData(series, get(highlightedAxis)!));

      return filteredSeries;
    } catch (e) {
      return Array(classifier.getFilters().count()).fill(0);
    }
  };

  let liveFilteredAxesData: number[] = getVectorValue();

  let valueInterval: NodeJS.Timeout = setInterval(() => {}, 100);

  const init = () => {
    denit();
    valueInterval = setInterval(() => {
      liveFilteredAxesData = getVectorValue();
    }, 250);

    setTimeout(
      () => {
        // We set a timeout to fix a graphical issue, that relates to the resizing of DOM elements
        updateArrows($highlightedAxis);
      },
      // We vary the timeout, because if no arrows exist, it must be the first render cycle which requres a bit more time (to avoid artifacts)
      $vectorArrows.length === 0 ? 200 : 0,
    );
  };

  const denit = () => {
    $vectorArrows.forEach(arr => arr.clear());
    clearInterval(valueInterval);
  };

  onMount(() => {
    init();
    return denit;
  });

  derived([highlightedAxis, classifier], s => s).subscribe(s => {
    init();
  });

  const filters = classifier.getFilters();
</script>

<div class:hidden={!$classifier.model.isTrained && !$classifier.model.isTraining}>
  <div>
    {#if $highlightedAxis}
      <div class="flex flex-row space-x-1">
        <div class="flex flex-col">
          <div class="flex flex-row space-x-2" id="fromX">
            <StandardButton
              small
              outlined={$highlightedAxis !== Axes.X}
              onClick={() => ($highlightedAxis = Axes.X)}>X</StandardButton>
          </div>
          <div class="flex flex-row space-x-2" id="fromY">
            <StandardButton
              small
              outlined={$highlightedAxis !== Axes.Y}
              onClick={() => ($highlightedAxis = Axes.Y)}>Y</StandardButton>
          </div>
          <div class="flex flex-row space-x-2" id="fromZ">
            <StandardButton
              small
              outlined={$highlightedAxis !== Axes.Z}
              onClick={() => ($highlightedAxis = Axes.Z)}>Z</StandardButton>
          </div>
        </div>
        <div class="pl-20 flex flex-col justify-around">
          {#each $filters as filter, index}
            <p class="pl-1" id={`arrowTo${index}`}>{filter.getName()}</p>
          {/each}
        </div>
        <div class="flex flex-col justify-around">
          {#each $filters as _}
            <img src={'imgs/right_arrow_blue.svg'} alt="right arrow icon" width="20px" />
          {/each}
        </div>
        <div class="flex flex-col justify-around">
          <img src={'imgs/left_bracket_blue.png'} alt="left bracket" />
        </div>
        <div class="flex flex-col justify-around w-12">
          {#each liveFilteredAxesData as val, index}
            <p style={`color:${['red', 'green', 'blue'][index]}`}>
              {val.toFixed(3)}
            </p>
          {/each}
        </div>
        <div class="flex flex-col justify-around">
          <img src={'imgs/right_bracket_blue.png'} alt="left bracket" />
        </div>
      </div>
    {/if}
  </div>
</div>
