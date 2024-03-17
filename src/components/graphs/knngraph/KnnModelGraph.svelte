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
  import { extractAxisFromTrainingData } from '../../../script/utils/graphUtils';
  import Axes from '../../../script/domain/Axes';
  import { TrainingData } from '../../../script/domain/ModelTrainer';
  import AxesFilterVector from './AxesFilterVector.svelte';
  import { highlightedAxis } from '../../../script/stores/uiStore';

  let controllerSingleX: KNNModelGraphController | undefined;
  let controllerSingleY: KNNModelGraphController | undefined;
  let controllerSingleZ: KNNModelGraphController | undefined;

  const classifierFactory = new ClassifierFactory();

  const dataGetter = (axis: Axes): TrainingData => {
    const allData = classifierFactory.buildTrainingData(
      gestures.getGestures(),
      classifier.getFilters(),
    );

    if (axis === Axes.X) {
      return extractAxisFromTrainingData(allData, 0, 3);
      // return extractFilterFromTrainingData(allData, 0, 3);
    }
    if (axis === Axes.Y) {
      return extractAxisFromTrainingData(allData, 1, 3);
      // return extractFilterFromTrainingData(allData, 1, 3);
    }
    if (axis === Axes.Z) {
      return extractAxisFromTrainingData(allData, 2, 3);
      // return extractFilterFromTrainingData(allData, 2, 3);
    }
    throw new Error('Should not happen');
  };

  const initSingle = (axis: Axes, label: string) => {
    const svgSingle = d3.selectAll('.d3-3d-single-' + label);
    const controller = new KNNModelGraphController(
      svgSingle,
      () => dataGetter(axis),
      'd3-3d-single-' + label,
      axis,
    );
    controller.setOrigin(650 / 2, 350 / 2);
    return controller;
  };

  onMount(() => {
    classifier.getFilters().clear();
    classifier.getFilters().add(FilterType.MAX);
    classifier.getFilters().add(FilterType.MIN);
    classifier.getFilters().add(FilterType.MEAN);
    controllerSingleX = initSingle(Axes.X, 'x');
    controllerSingleY = initSingle(Axes.Y, 'y');
    controllerSingleZ = initSingle(Axes.Z, 'z');
  });
</script>

<div class="flex flex-row" class:hidden={!$classifier.model.isTrained}>
  <div class="flex flex-col justify-center mr-6">
    <AxesFilterVector />
  </div>
  <div>
    <KnnModelGraphSvgWithControls
      hidden={$highlightedAxis !== Axes.X}
      height={350}
      width={650}
      classID={'d3-3d-single-x'}
      controller={controllerSingleX} />
    <KnnModelGraphSvgWithControls
      hidden={$highlightedAxis !== Axes.Y}
      height={350}
      width={650}
      classID={'d3-3d-single-y'}
      controller={controllerSingleY} />
    <KnnModelGraphSvgWithControls
      hidden={$highlightedAxis !== Axes.Z}
      height={350}
      width={650}
      classID={'d3-3d-single-z'}
      controller={controllerSingleZ} />
  </div>
</div>
