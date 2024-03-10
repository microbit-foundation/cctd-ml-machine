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
  import StandardDropdownButton from '../../buttons/StandardDropdownButton.svelte';
  import { DropdownOption } from '../../buttons/Buttons';
  import AxesFilterVector from './AxesFilterVector.svelte';

  let controllerSingle: KNNModelGraphController | undefined;

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

  const initSingle = () => {
    const svgSingle = d3.selectAll('.d3-3d-single');
    controllerSingle = new KNNModelGraphController(
      svgSingle,
      () => dataGetter(Axes.X),
      'd3-3d-single',
      Axes.X,
    );
    controllerSingle.setOrigin(650 / 2, 350 / 2);
  };

  onMount(() => {
    classifier.getFilters().clear();
    classifier.getFilters().add(FilterType.MAX);
    classifier.getFilters().add(FilterType.MIN);
    classifier.getFilters().add(FilterType.MEAN);
    initSingle();
  });
</script>

<div class="flex flex-row">
  <div class="flex flex-col justify-center mr-6">
    <AxesFilterVector />
  </div>
  <div>
    <KnnModelGraphSvgWithControls
      height={350}
      width={650}
      classID={'d3-3d-single'}
      controller={controllerSingle} />
  </div>
</div>
