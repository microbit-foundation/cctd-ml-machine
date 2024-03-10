<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { Readable, derived, writable } from 'svelte/store';
  import { classifier, liveAccelerometerData } from '../../../script/stores/Stores';
  import StaticConfiguration from '../../../StaticConfiguration';
  import Axes from '../../../script/domain/Axes';
  import { extractAxisFromAccelerometerData } from '../../../script/utils/graphUtils';
  import StandardButton from '../../buttons/StandardButton.svelte';

  const selectedAxis = writable(Axes.X);

  const liveFilteredAxesData: Readable<number[]> = derived(
    [liveAccelerometerData, selectedAxis],
    stores => {
      const axis = stores[1];
      try {
        const seriesTimestamped = liveAccelerometerData
          .getBuffer()
          .getSeries(
            StaticConfiguration.pollingPredictionSampleDuration,
            StaticConfiguration.pollingPredictionSampleSize,
          );
        const series = seriesTimestamped.map(s => s.value);
        return classifier
          .getFilters()
          .compute(extractAxisFromAccelerometerData(series, axis));
      } catch (e) {
        console.log(e);
        return Array(classifier.getFilters().count()).fill(0);
      }
    },
  );

</script>

<div>
  <div>
    <div class="flex flex-row space-x-1">
      <div class="flex flex-col">
        <div class="flex flex-row space-x-2">
          <StandardButton
            small
            outlined={$selectedAxis !== Axes.X}
            onClick={() => ($selectedAxis = Axes.X)}>X</StandardButton>
        </div>
        <div class="flex flex-row space-x-2">
          <StandardButton
            small
            outlined={$selectedAxis !== Axes.Y}
            onClick={() => ($selectedAxis = Axes.Y)}>Y</StandardButton>
        </div>
        <div class="flex flex-row space-x-2">
          <StandardButton
            small
            outlined={$selectedAxis !== Axes.Z}
            onClick={() => ($selectedAxis = Axes.Z)}>Z</StandardButton>
        </div>
      </div>
      <div class="flex flex-col justify-around">
        <img src={'imgs/vector_lines_x.png'} class:hidden={$selectedAxis !== Axes.X} alt="x vector line"/>
        <img src={'imgs/vector_lines_y.png'} class:hidden={$selectedAxis !== Axes.Y} alt="y vector line"/>
        <img src={'imgs/vector_lines_z.png'} class:hidden={$selectedAxis !== Axes.Z} alt="z vector line"/>
        </div>
      <div class="flex flex-col justify-around">
        <p>MAX</p>
        <p>MIN</p>
        <p>MEAN</p>
      </div>
      <div class="flex flex-col justify-around">
        <img src={'imgs/right_arrow_blue.svg'} alt="right arrow icon" width="20px" />
        <img src={'imgs/right_arrow_blue.svg'} alt="right arrow icon" width="20px" />
        <img src={'imgs/right_arrow_blue.svg'} alt="right arrow icon" width="20px" />
      </div>
      <div class="flex flex-col justify-around">
        <img src={'imgs/left_bracket_blue.png'} alt="left bracket" />
    </div>
      <div class="flex flex-col justify-around w-12">
        {#each $liveFilteredAxesData as val}
          <p>{val.toFixed(3)}</p>
        {/each}
      </div>
      <div class="flex flex-col justify-around">
        <img src={'imgs/right_bracket_blue.png'} alt="left bracket" />
    </div>
    </div>
  </div>
</div>
