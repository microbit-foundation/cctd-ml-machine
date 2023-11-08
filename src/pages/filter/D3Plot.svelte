<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import * as d3 from 'd3';
  import { FilterType, determineFilter } from '../../script/datafunctions';
  import { GestureData, gestures } from '../../script/stores/mlStore';
  import { state } from '../../script/stores/uiStore';
  import { getPrevData } from '../../script/stores/mlStore';
    import { Path } from 'three';

  export let filter: FilterType;
  export let fullScreen: boolean = false;

  $: showLive = $state.isInputConnected;

  const uniqueLiveDataID = 983095438740;

  const plotSize = fullScreen ? 800 : 400;

  const createLiveData = () => {
    const liveData = getPrevData();
    if (liveData === undefined) return undefined;
    const filteredData: RecordingRepresentation = {
      ID: uniqueLiveDataID,
      gestureClassName: 'live',
      gestureClassID: uniqueLiveDataID,
      x: filterFunction(liveData.x),
      y: filterFunction(liveData.y),
      z: filterFunction(liveData.z),
    };
    return filteredData;
  };

  let plot: any = undefined;

  let notMountedYet = true;

  let publicClassList: { name: string; id: number }[] = [];

  type RecordingRepresentation = {
    ID: number;
    gestureClassName: string;
    gestureClassID: number;
    x: number;
    y: number;
    z: number;
  };

  type Axis = 'x' | 'y' | 'z';

  const filterStrategy = determineFilter(filter);
  const filterFunction = (data: number[]) => filterStrategy.computeOutput(data);
  let color: d3.ScaleOrdinal<string, string> | undefined = undefined;

  const getColorForClass = (gestureID: string) => {
    if (color === undefined) {
      throw new Error('Cannot get color for gesture, color function not defined');
    }
    return color(gestureID);
  };

  const getStrokeColor = (gesture: unknown) => {
    const gestureID = (gesture as RecordingRepresentation).gestureClassID;
    if (!gestureID) {
      throw new Error('The given gesture did not contain a gestureClass');
    }
    return getColorForClass(gestureID.toString());
  };

  const getExtent = (axis: Axis, data: RecordingRepresentation[]) => {
    const extent = d3.extent(data, function (gesture: unknown) {
      const value: number = (gesture as RecordingRepresentation)[axis];
      return value;
    });
    if (extent[0] === undefined) {
      throw new Error('Unable to find extent of data!');
    }
    return extent;
  };

  const createDataRepresentation = () => {
    const classes: { name: string; id: number }[] = [];
    const data: GestureData[] = get(gestures);
    const recordings: RecordingRepresentation[] = [];
    data.map(gestureClassObject => {
      const gestureClassName: string = gestureClassObject.name;
      const gestureClassID: number = gestureClassObject.ID;
      const gestureClass = { name: gestureClassName, id: gestureClassID };
      if (!classes.includes(gestureClass)) {
        classes.push(gestureClass);
      }
      gestureClassObject.recordings.map(recording => {
        const ID = recording.ID;
        const x = filterFunction(recording.data.x);
        const y = filterFunction(recording.data.y);
        const z = filterFunction(recording.data.z);
        recordings.push({ ID, gestureClassName, gestureClassID, x, y, z });
      });
    });
    const liveDataRep = createLiveData();
    if (liveDataRep !== undefined && showLive) {
      recordings.push(liveDataRep);
      classes.push({ name: 'live', id: uniqueLiveDataID });
    }
    const classesIDs = classes.map(c => c.id.toString());
    color = d3.scaleOrdinal<string>().domain(classesIDs).range(d3.schemeSet3);
    publicClassList = classes;
    return { recordings, classes };
  };

  // Draw chart

  // set the dimensions and margins of the graph
  const margin = { top: 30, right: 10, bottom: 10, left: 0 };
  const width = plotSize - margin.left - margin.right;
  const height = plotSize * 0.75 - margin.top - margin.bottom;

  function onInterval(callback: () => void, milliseconds: number) {
    const interval = setInterval(callback, milliseconds);
    onDestroy(() => {
      clearInterval(interval);
    });
  }

  onInterval(() => {
    const { recordings, classes } = createDataRepresentation();
    const classesIDs = classes.map(c => c.id.toString());
    drawParallelPlot(recordings, classesIDs, plot);
  }, 100);

  onMount(() => {
    notMountedYet = false;
    // append the svg object for plot
    plot = d3
      .select('#parallel-plot-' + filter)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  });

  // Highlight the specie that is hovered
  const highlight = function (
    event: any,
    gesture: RecordingRepresentation | { gestureClassID: number },
  ) {
    const gestureID = 's' + gesture.gestureClassID;

    // first every group turns grey
    d3.selectAll('.line')
      .transition()
      .duration(200)
      .style('stroke', 'lightgrey')
      .style('opacity', '0.2');
    // Second the hovered specie takes its color
    d3.selectAll('.' + gestureID)
      .transition()
      .duration(200)
      .style('stroke', (gesture: unknown) => {
        const id = (gesture as RecordingRepresentation).gestureClassID;
        if (!id) {
          throw new Error('The given gesture did not contain a gestureClass');
        }
        return getColorForClass(id.toString());
      })
      .style('opacity', '1');
  };

  // Unhighlight
  const doNotHighlight = function () {
    d3.selectAll('.line')
      .transition()
      .duration(200)
      .delay(1000)
      .style('stroke', getStrokeColor)
      .style('opacity', '1');
  };

  let plotDrawn = false;
  
  const dimensions: Axis[] = ['x', 'y', 'z'];

  type PathDrawer = (gesture: RecordingRepresentation) => string | null;

  function drawLines(data: RecordingRepresentation[], plot: any, path: PathDrawer) {
    plot
      .selectAll()
      .data(data)
      .enter()
      .append('path')
      .attr('class', function (gesture: RecordingRepresentation) {
        return 'line ' + 's' + gesture.gestureClassID;
      }) // 2 class for each line: 'line' and the group name
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', function (gesture: RecordingRepresentation) {
        return getColorForClass(gesture.gestureClassID.toString());
      })
      .style('opacity', function (gesture: RecordingRepresentation) {
        return 0.8;
      })
      .style('stroke-width', function (gesture: RecordingRepresentation) {
        return 4;
      })
      .on('mouseover', highlight)
      .on('mouseleave', doNotHighlight);
  }


  // --------- DRAW PLOT ---------------
  function drawParallelPlot(
    data: RecordingRepresentation[],
    classes: string[],
    plot: any,
  ) {
    if (notMountedYet) return;
    

    // For each dimension, I build a linear scale. I store all in a y object
    let y: any = {};
    for (let i in dimensions) {
      let axis: Axis = dimensions[i];
      y[axis] = d3.scaleLinear().domain(getExtent(axis, data)).range([height, 0]);
    }

    // Build the X scale -> it find the best position for each Y axis
    const x = d3.scalePoint().range([15, width]).padding(0.1).domain(dimensions);

    // Extract the list of dimensions we want to keep in the plot.
    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(gesture: RecordingRepresentation) {
      return d3.line()(
        dimensions.map(function (axis: Axis) {
          return [x(axis) as number, y[axis](gesture[axis])];
        }),
      );
    }

    if (plotDrawn) {
      const livePath = plot.select('.s'+uniqueLiveDataID);

      if (!showLive) {
        if (!livePath.empty()) {
         livePath.remove();
        }
        return;
      }

      if (livePath.empty() && (data.at(-1) as RecordingRepresentation).gestureClassID === uniqueLiveDataID) {
        // Insert live data path
        drawLines([data.pop() as RecordingRepresentation], plot, path);
      } else {
        // Update live path
        const newLivePathLine = () => path(data.pop() as RecordingRepresentation);
        // Animate
        livePath.transition().duration(50).attr('d', newLivePathLine);
      }
      return;
    }

    // Draw the axis:
    plot
      .selectAll()
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions)
      .enter()
      .append('g')
      .attr('class', 'axis')
      // I translate this element to its right position on the x axis
      .attr('transform', function (axis: Axis) {
        return 'translate(' + x(axis) + ')';
      })
      // And I build the axis with the call function
      .each(function (this: SVGGraphicsElement, axis: Axis) {
        d3.select(this).call(d3.axisLeft(d3.scaleLinear()).ticks(4).scale(y[axis]));
      })
      // Add axis title
      .append('text')
      .style('text-anchor', 'middle')
      .style('font-size', '20px')
      .style('fill', function (axis: Axis) {
        if (axis === 'x') return '#f9808e';
        if (axis === 'y') return '#80f98e';
        return '#808ef9';
      })
      .attr('y', -9)
      .text(function (axis: Axis) {
        return axis;
      });

    drawLines(data, plot, path);
      
    plotDrawn = true;
  }
</script>

<div class="flex">
  <div class="flex flex-col justify-evenly mr-4">
    {#each publicClassList as c}
      <div
        class="py-1 px-4 rounded-md btn transition ease border select-none focusElement"
        style="background-color: {getColorForClass(c.id.toString())};"
        on:mouseenter={() => highlight(null, { gestureClassID: c.id })}
        on:mouseleave={doNotHighlight}>
        {c.name}
      </div>
    {/each}
  </div>
  <div id={'parallel-plot-' + filter} class="relative" />
</div>
