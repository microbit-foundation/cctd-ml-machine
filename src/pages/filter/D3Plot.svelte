<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

 <script lang="ts">
    import { onMount } from "svelte";
    import { get } from 'svelte/store';
    import * as d3 from "d3";    
    import {
        Axes,
        AxesType,
        FilterType,
        clamp,
        determineFilter,
    } from '../../script/datafunctions';
    import { GestureData, gestures } from '../../script/stores/mlStore';

    export let filter: FilterType;
    export let gesture: GestureData | undefined = undefined;
    export let legendPosition: 'top' | 'right' = 'top';
    export let aspectRatio: number | undefined = undefined;
    export let displayLegend = true;
    export let displayYTicks = true;
    export let forcedColor: string | undefined = undefined;

    let plot: any = undefined;

    let notMountedYet = true;
    $: drawParallelPlot(createDataRepresentation(), plot);

    type RecordingRepresentation = {
      ID: number;
      gestureClass: string;
      x: number;
      y: number;
      z: number;
    }

    type axis = "x" | "y" | "z";

    const filterStrategy = determineFilter(filter);
    const filterFunction = (data: number[]) => filterStrategy.computeOutput(data);
    const classes: string[] = [];

    const createDataRepresentation = () => {
      const data: GestureData[] = get(gestures);
      console.log("data", data);
      const recordings: RecordingRepresentation[] = [];
      data.map((gestureClassObject) => {
         const gestureClass: string = gestureClassObject.name;
         if (!classes.includes(gestureClass)) {
           classes.push(gestureClass);
         };
        gestureClassObject.recordings.map(recording => {
          const ID = recording.ID;
          const x =  filterFunction(recording.data.x);
          const y = filterFunction(recording.data.y);
          const z = filterFunction(recording.data.z);        
          recordings.push({ID, gestureClass, x, y, z});
       });
      });
      return recordings;
    }
    console.log("dataRep", createDataRepresentation());

    console.log("classes", classes);

    // Draw chart

      // set the dimensions and margins of the graph
  const margin = { top: 30, right: 10, bottom: 10, left: 0 },
    width = 700 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    const opacity = d3.scaleOrdinal().domain(classes).range([0.5, 0.5, 0.5, 0.5]);

    const strokeWidth = d3.scaleOrdinal().domain(classes).range([4, 4, 4]);

    onMount(() => {
      notMountedYet = false;
      // append the svg object for plot
      plot = d3
        .select("#parallel-plot-" + filter)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      drawParallelPlot(createDataRepresentation(), plot);
    });

    function drawParallelPlot(data: RecordingRepresentation[], plot: any) {
    if (notMountedYet) return;
    // Delete existing plot
    if (plot) plot.selectAll("*").remove();
      console.log("d3", d3);
    // Extract the list of dimensions we want to keep in the plot.
    const dimensions: axis[] = ["x", "y", "z"];

    // For each dimension, I build a linear scale. I store all in a y object

 
    let y: any = {};
    for (let i in dimensions) {
      let axis: axis = dimensions[i];
      y[axis] = d3
        .scaleLinear()
        .domain(
          d3.extent(data, function (gesture: RecordingRepresentation) {
            const value: number = gesture[axis];
            return value;
          })
        )
        .range([height, 0]);
    }

    console.log("y", y);

    // Build the X scale -> it find the best position for each Y axis
    const x = d3.scalePoint().range([0, width]).padding(1).domain(dimensions);

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(gesture: RecordingRepresentation) {
      return d3.line()(
        dimensions.map(function (axis: axis) {
          return [x(axis), y[axis](gesture[axis])];
        })
      );
    }

    // Draw the lines
    plot
      .selectAll() // black magic
      .data(data)
      .enter()
      .append("path")
      .attr("class", function (gesture: RecordingRepresentation) {
        return "line " + gesture.gestureClass;
      }) // 2 class for each line: 'line' and the group name
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", function (gesture: RecordingRepresentation) {
        return (gesture.gestureClass === "syste") ? "green" : "yellow" })
      .style("opacity", function (gesture: RecordingRepresentation) {
        return opacity(gesture.gestureClass);
      })
      .style("stroke-width", function (gesture: RecordingRepresentation) {
        return strokeWidth(gesture.gestureClass);
      })
      //.on("mouseover", highlight)
      //.on("mouseleave", doNotHighlight);

    // Draw the axis:
    plot
      .selectAll()
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "axis")
      // I translate this element to its right position on the x axis
      .attr("transform", function (axis: axis) {
        return "translate(" + x(axis) + ")";
      })
      // And I build the axis with the call function
      .each(function (axis: axis) {
        const t: string = this;
        d3.select(t).call(d3.axisLeft().ticks(4).scale(y[axis]));
      })
      // Add axis title
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function (axis: axis) {
        return axis;
      })
      .style("fill", "black");
  }
 </script>

<div id={"parallel-plot-" + filter} class="relative -left-35" />