<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

 <script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { get } from 'svelte/store';
    import * as d3 from "d3";    
    import {
        FilterType,
        determineFilter,
    } from '../../script/datafunctions';
    import { GestureData, gestures } from '../../script/stores/mlStore';
    import { state } from "../../script/stores/uiStore";
    import { getPrevData } from '../../script/stores/mlStore';


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
        gestureClass: "live",
        x: filterFunction(liveData.x),
        y: filterFunction(liveData.y),
        z: filterFunction(liveData.z),
      };
      return filteredData;
    };
    
    let plot: any = undefined;

    let notMountedYet = true;

    let publicClassList: string[] = [];

    type RecordingRepresentation = {
      ID: number;
      gestureClass: string;
      x: number;
      y: number;
      z: number;
    }

    type Axis = "x" | "y" | "z";

    const filterStrategy = determineFilter(filter);
    const filterFunction = (data: number[]) => filterStrategy.computeOutput(data);
    let color: d3.ScaleOrdinal<string, string> | undefined = undefined;

    const getColorForClass = (gestureName: string) => {
      if (color === undefined) {
          throw new Error("Cannot get color for gesture, color function not defined");
      }
      return color(gestureName);
    }

    const getStrokeColor = (gesture: unknown) => {
          const name = (gesture as RecordingRepresentation).gestureClass;
          if (!name) {
          throw new Error("The given gesture did not contain a gestureClass")
        }
          return getColorForClass(name);
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
      const classes: string[] & Iterable<string> = [];
      const data: GestureData[] = get(gestures);
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
      const liveDataRep = createLiveData();
      if (liveDataRep !== undefined && showLive) {
        recordings.push(liveDataRep);
        classes.push("live");
      }
      color = d3.scaleOrdinal<string>().domain(classes).range(d3.schemeSet3);
      publicClassList = classes;
      return {recordings, classes};
    }

    // Draw chart

      // set the dimensions and margins of the graph
  const margin = { top: 30, right: 10, bottom: 10, left: 0 }
  const width = plotSize - margin.left - margin.right;
  const height = plotSize * 0.75 - margin.top - margin.bottom;


    function onInterval(callback: () => void, milliseconds: number) {
      const interval = setInterval(callback, milliseconds);
      onDestroy(() => {
        clearInterval(interval);
      });
    }

    onInterval(() => {
      const {recordings, classes} = createDataRepresentation();
      drawParallelPlot(recordings, classes, plot);
    }, 100);

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
    });

    // Highlight the specie that is hovered
    const highlight = function(event: any, gesture: RecordingRepresentation | {gestureClass: string}){
      const gestureName = gesture.gestureClass

      // first every group turns grey
      d3.selectAll(".line")
        .transition().duration(200)
        .style("stroke", "lightgrey")
        .style("opacity", "0.2")
      // Second the hovered specie takes its color
      d3.selectAll("." + gestureName)
        .transition().duration(200)
        .style("stroke", (gesture: unknown) => {
          const name = (gesture as RecordingRepresentation).gestureClass;
          if (!name) {
          throw new Error("The given gesture did not contain a gestureClass")
        }
          return getColorForClass(name);
        })
        .style("opacity", "1")
    }

    // Unhighlight
    const doNotHighlight = function(){
      d3.selectAll(".line")
        .transition().duration(200).delay(1000)
        .style("stroke", getStrokeColor)
        .style("opacity", "1")
    }

    let plotDrawn = false;

    function drawParallelPlot(data: RecordingRepresentation[], classes: String[], plot: any) {
      if (notMountedYet) return;

      const opacity = d3.scaleOrdinal().domain(classes as Iterable<string>).range([0.5, 0.5, 0.5, 0.5]);

      const strokeWidth = d3.scaleOrdinal().domain(classes as Iterable<string>).range([4, 4, 4]);
      // Delete existing plot
      const dimensions: Axis[] = ["x", "y", "z"];
    
      // For each dimension, I build a linear scale. I store all in a y object
      let y: any = {};
      for (let i in dimensions) {
        let axis: Axis = dimensions[i];
        y[axis] = d3
          .scaleLinear()
          .domain(getExtent(axis, data))
          .range([height, 0]);
      }

      // Build the X scale -> it find the best position for each Y axis
      const x = d3.scalePoint().range([15, width]).padding(0.1).domain(dimensions);

      if (plotDrawn) {
        const livePath = plot.select(".live");

        if (!showLive) {
          if (!livePath.empty()) {
            plot
              .select(".live").remove()
          }
          return;
        }     

        if (livePath.empty()) {
          // Insert live data path
          plot
          .selectAll()
          .data([data.pop() as RecordingRepresentation])
          .enter()
          .append("path")
          .attr("class", function (gesture: RecordingRepresentation) {
            return "line " + gesture.gestureClass;
          }) // 2 class for each line: 'line' and the group name
          .attr("d", path)
          .style("fill", "none")
          .style("stroke", function (gesture: RecordingRepresentation) {
            return getColorForClass(gesture.gestureClass);
          })
          .style("opacity", function (gesture: RecordingRepresentation) {
            return opacity(gesture.gestureClass);
          })
          .style("stroke-width", function (gesture: RecordingRepresentation) {
            return strokeWidth(gesture.gestureClass);
          })
        } else {
          // Update live path
          const newLivePathLine = () => path(data.pop() as RecordingRepresentation);
          // Animate
          plot.select(".live").transition().duration(50).attr("d", newLivePathLine);
        }   
        return;
      } else {
        plotDrawn = true;
      }
      // Extract the list of dimensions we want to keep in the plot.
      // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
      function path(gesture: RecordingRepresentation) {
        return d3.line()(
          dimensions.map(function (axis: Axis) {
            return [x(axis) as number, y[axis](gesture[axis])];
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
          return getColorForClass(gesture.gestureClass);
        })
        .style("opacity", function (gesture: RecordingRepresentation) {
          return opacity(gesture.gestureClass);
        })
        .style("stroke-width", function (gesture: RecordingRepresentation) {
          return strokeWidth(gesture.gestureClass);
        })
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight);

      // Draw the axis:
      plot
        .selectAll()
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions)
        .enter()
        .append("g")
        .attr("class", "axis")
        // I translate this element to its right position on the x axis
        .attr("transform", function (axis: Axis) {
          return "translate(" + x(axis) + ")";
        })
        // And I build the axis with the call function
        .each(function (this: SVGGraphicsElement, axis: Axis) {
          d3.select(this).call(d3.axisLeft(d3.scaleLinear()).ticks(4).scale(y[axis]));
        })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", function (axis: Axis) {
          if (axis === "x") return "#f9808e";
          if (axis === "y") return "#80f98e";
          return "#808ef9";
        })
        .attr("y", -9)
        .text(function (axis: Axis) {
          return axis;
        });
    }

 </script>
<div class="flex">
  <div class="flex flex-col justify-evenly mr-4">
    {#each publicClassList as c}
      <div
        class="py-1 px-4 rounded-md btn transition ease border select-none focusElement"
        style="background-color: {getColorForClass(c)};"
        on:mouseenter={() => highlight(null, {gestureClass: c})}
        on:mouseleave={doNotHighlight}
        >
        {c}
      </div>
    {/each}
  </div>
  <div id={"parallel-plot-" + filter} class="relative" />
</div>