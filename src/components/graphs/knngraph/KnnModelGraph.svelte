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

  let controllerX: KNNModelGraphController | undefined;
  let controllerY: KNNModelGraphController | undefined;
  let controllerZ: KNNModelGraphController | undefined;

  const classifierFactory = new ClassifierFactory();

  const dataGetter = (axis: Axes): TrainingData => {
    const allData = classifierFactory.buildTrainingData(
      gestures.getGestures(),
      classifier.getFilters(),
    );

    if (axis === Axes.X) {
      return extractAxisFromTrainingData(allData, 0, 3);
    }

    if (axis === Axes.Y) {
      return extractAxisFromTrainingData(allData, 1, 3);
    }
    if (axis === Axes.Z) {
      return extractAxisFromTrainingData(allData, 2, 3);
    }
    throw new Error('Should happen');
  };

  onMount(() => {
    const svgx = d3.selectAll('.d3-3d-x');
    const svgy = d3.selectAll('.d3-3d-y');
    const svgz = d3.selectAll('.d3-3d-z');
    console.log(svgx, svgy);
    classifier.getFilters().clear();
    classifier.getFilters().add(FilterType.MAX);
    classifier.getFilters().add(FilterType.MIN);
    classifier.getFilters().add(FilterType.MEAN);
    controllerX = new KNNModelGraphController(svgx, () => dataGetter(Axes.X), 'd3-3d-x', Axes.X);
    controllerY = new KNNModelGraphController(svgy, () => dataGetter(Axes.Y), 'd3-3d-y', Axes.Y);
    controllerZ = new KNNModelGraphController(svgz, () => dataGetter(Axes.Z), 'd3-3d-z', Axes.Z);
    controllerX.setOrigin(150, 150);
    controllerY.setOrigin(150, 150);
    controllerZ.setOrigin(150, 150);
  });
</script>

<div class="flex flex-row gap-3">
  <div>
    <p>X axis</p>
    <KnnModelGraphSvgWithControls
      height={300}
      width={300}
      classID={'d3-3d-x'}
      controller={controllerX} />
  </div>
  <div>
    <p>Y axis</p>
    <KnnModelGraphSvgWithControls
      height={300}
      width={300}
      classID={'d3-3d-y'}
      controller={controllerY} />
  </div>
  <div>
    <p>Z axis</p>
    <KnnModelGraphSvgWithControls
      height={300}
      width={300}
      classID={'d3-3d-z'}
      controller={controllerZ} />
  </div>
</div>
