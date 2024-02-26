<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
 <script lang="ts">
  import { onMount } from 'svelte';
  import KNNModelGraphController from './KNNModelGraphController';
  import * as d3 from 'd3';
  import { classifier, gestures } from '../../../script/stores/Stores';
  import ClassifierFactory from '../../../script/domain/ClassifierFactory';
  import { FilterType } from '../../../script/domain/FilterTypes';
  import KnnModelGraphSvgWithControls from './KnnModelGraphSvgWithControls.svelte';
  import {
    extractAxisFromTrainingData,
    extractFilterFromTrainingData,
  } from '../../../script/utils/graphUtils';
  import Axes from '../../../script/domain/Axes';
  import { TrainingData } from '../../../script/domain/ModelTrainer';
  import StandardButton from '../../buttons/StandardButton.svelte';

  let controllerX: KNNModelGraphController | undefined;
  let controllerY: KNNModelGraphController | undefined;
  let controllerZ: KNNModelGraphController | undefined;

  let controllerCombined: KNNModelGraphController | undefined;

  const classifierFactory = new ClassifierFactory();

  const dataGetter = (axis: Axes): TrainingData => {
    const allData = classifierFactory.buildTrainingData(
      gestures.getGestures(),
      classifier.getFilters(),
    );

    if (axis === Axes.X) {
      //return extractAxisFromTrainingData(allData, 0, 3);
      return extractFilterFromTrainingData(allData, 0, 3);
    }
    if (axis === Axes.Y) {
      //return extractAxisFromTrainingData(allData, 1, 3);
      return extractFilterFromTrainingData(allData, 1, 3);
    }
    if (axis === Axes.Z) {
      // return extractAxisFromTrainingData(allData, 2, 3);
      return extractFilterFromTrainingData(allData, 2, 3);
    }
    throw new Error('Should happen');
  };

  const dataGetterCombined = (): TrainingData => {
    const allData = classifierFactory.buildTrainingData(
      gestures.getGestures(),
      classifier.getFilters(),
    );
    return allData;
  };

  const initSeparated = () => {
    const svgx = d3.selectAll('.d3-3d-x');
    const svgy = d3.selectAll('.d3-3d-y');
    const svgz = d3.selectAll('.d3-3d-z');

    // WIP: We are not filtering based on axes, but on filters instead
    controllerX = new KNNModelGraphController(
      svgx,
      () => dataGetter(Axes.X),
      'd3-3d-x',
      Axes.X,
    );
    controllerY = new KNNModelGraphController(
      svgy,
      () => dataGetter(Axes.Y),
      'd3-3d-y',
      Axes.Y,
    );
    controllerZ = new KNNModelGraphController(
      svgz,
      () => dataGetter(Axes.Z),
      'd3-3d-z',
      Axes.Z,
    );
    controllerX.setOrigin(150, 350/2);
    controllerY.setOrigin(150, 350/2);
    controllerZ.setOrigin(150, 350/2);
  };

  const initCombined = () => {
    const svgCombined = d3.selectAll('.d3-3d-combined');
    controllerCombined = new KNNModelGraphController(
      svgCombined,
      dataGetterCombined,
      'd3-3d-combined',
      undefined,
    );
    controllerCombined.setOrigin(900/2, 350/2);
  };
  let separateByFilter = true;

  onMount(() => {
    classifier.getFilters().clear();
    classifier.getFilters().add(FilterType.MAX);
    classifier.getFilters().add(FilterType.MIN);
    classifier.getFilters().add(FilterType.MEAN);
    if (separateByFilter) {
      initSeparated();
    } else {
      initCombined();
    }
  });

  const setSeparateByFilter = (separate: boolean) => {
    separateByFilter = separate;
    setTimeout(() => {
      if (separate) {
        initSeparated();
      } else {
        initCombined();
      }
    }, 200);
  };
</script>

<StandardButton outlined={!separateByFilter} onClick={() => setSeparateByFilter(true)}
  >View by filter</StandardButton>
<StandardButton outlined={separateByFilter} onClick={() => setSeparateByFilter(false)}
  >View all</StandardButton>
{#if separateByFilter}
  <div class="flex flex-row gap-3">
    <div>
      <p>MAX Filter</p>
      <KnnModelGraphSvgWithControls
        height={350}
        width={300}
        classID={'d3-3d-x'}
        controller={controllerX} />
    </div>
    <div>
      <p>MIN Filter</p>
      <KnnModelGraphSvgWithControls
        height={350}
        width={300}
        classID={'d3-3d-y'}
        controller={controllerY} />
    </div>
    <div>
      <p>MEAN Filter</p>
      <KnnModelGraphSvgWithControls
        height={350}
        width={300}
        classID={'d3-3d-z'}
        controller={controllerZ} />
    </div>
  </div>
{:else}
  <div>
    <KnnModelGraphSvgWithControls
      height={350}
      width={900}
      classID={'d3-3d-combined'}
      controller={controllerCombined} />
  </div>
{/if}
