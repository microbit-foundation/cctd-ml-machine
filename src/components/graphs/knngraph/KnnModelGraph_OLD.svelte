<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import {
    triangles3D,
    cubes3D,
    gridPlanes3D,
    points3D,
    lineStrips3D,
    lines3D,
  } from 'd3-3d';
  import { Point3D, Point3DTransformed } from '../../../script/TypingUtils';
  import ClassifierFactory from '../../../script/domain/ClassifierFactory';
  import { classifier, gestures } from '../../../script/stores/Stores';

  let rotationX = 0;
  let rotationY = 0;
  const rotationZ = 0;

  const draw = (drawRotationX: number, drawRotationY: number) => {
    const addPoints = (
      svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
      points: Point3DTransformed[][][],
      i: number, // Class
      j: number, // Filter
      color: string,
    ) => {
      const samplePoints = svg.selectAll(`circle.points-class-${i}`).data(points[i]);
      samplePoints
        .enter()
        .append('circle')
        .attr('class', `d3-3d points-class-${i}-${j}`)
        .attr('fill', color)
        .attr('cx', d => {
          return d[j].projected.x;
        })
        .attr('cy', d => {
          return d[j].projected.y;
        })
        .attr('r', 2);
    };

    const addScales = (svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>) => {
      const xScale: any = svg.selectAll('path.xScale').data(xLineProjected);
      xScale
        .enter()
        .append('line')
        .attr('class', 'd3-3d xScale')
        .merge(xScale)
        .attr('x1', (data: Point3DTransformed[]) => data[0].projected.x)
        .attr('y1', (data: Point3DTransformed[]) => data[0].projected.y)
        .attr('x2', (data: Point3DTransformed[]) => data[1].projected.x)
        .attr('y2', (data: Point3DTransformed[]) => data[1].projected.y)
        .attr('stroke', 'red')
        .attr('stroke-width', 1);

      const yScale: any = svg.selectAll('path.yScale').data(yLineProjected);
      yScale
        .enter()
        .append('line')
        .attr('class', 'd3-3d yScale')
        .merge(yScale)
        .attr('x1', (data: Point3DTransformed[]) => data[0].projected.x)
        .attr('y1', (data: Point3DTransformed[]) => data[0].projected.y)
        .attr('x2', (data: Point3DTransformed[]) => data[1].projected.x)
        .attr('y2', (data: Point3DTransformed[]) => data[1].projected.y)
        .attr('stroke', 'green')
        .attr('stroke-width', 1);

      const zScale: any = svg.selectAll('path.zScale').data(zLineProjected);
      zScale
        .enter()
        .append('line')
        .attr('class', 'd3-3d zScale')
        .merge(zScale)
        .attr('x1', (data: Point3DTransformed[]) => data[0].projected.x)
        .attr('y1', (data: Point3DTransformed[]) => data[0].projected.y)
        .attr('x2', (data: Point3DTransformed[]) => data[1].projected.x)
        .attr('y2', (data: Point3DTransformed[]) => data[1].projected.y)
        .attr('stroke', 'blue')
        .attr('stroke-width', 1);
    };

    const pointTransform = points3D()
      .rotateZ(rotationZ)
      .rotateX(drawRotationX)
      .rotateY(drawRotationY)
      .origin({ x: 150, y: 150 })
      .scale(40);
    const lineTransform = lines3D()
      .rotateZ(rotationZ)
      .rotateX(drawRotationX)
      .rotateY(drawRotationY)
      .origin({ x: 150, y: 150 })
      .scale(40);

    const xLine = [
      { x: -1000, y: 0, z: 0 },
      { x: 1000, y: 0, z: 0 },
    ];
    const yLine = [
      { x: 0, y: -1000, z: 0 },
      { x: 0, y: 1000, z: 0 },
    ];
    const zLine = [
      { x: 0, y: 0, z: -1000 },
      { x: 0, y: 0, z: 1000 },
    ];
    const xLineProjected: Point3DTransformed[] = lineTransform([xLine]);
    const yLineProjected: Point3DTransformed[] = lineTransform([yLine]);
    const zLineProjected: Point3DTransformed[] = lineTransform([zLine]);

    // console.log(projectedPoints);
    console.log(pointTransform);
    console.log('xLineProjected', xLineProjected);
    console.log('yLineProjected', yLineProjected);
    console.log('zLineProjected', zLineProjected);

    const svg = d3.select('#here');
    svg.selectAll('*').remove();
    addScales(svg);

    const points = traningDataToPoints(); // Raw points in 3d space
    console.log('computed points', points);
    addPoints(svg, points, 0, 0, '#fc0303');
    addPoints(svg, points, 1, 0, '#5d00ff');
    addPoints(svg, points, 2, 0, '#00ff91');
    addPoints(svg, points, 0, 1, '#fc038c');
    addPoints(svg, points, 1, 1, '#5d00ff');
    addPoints(svg, points, 2, 1, '#00ff04');
    addPoints(svg, points, 0, 2, '#ba022a');
    addPoints(svg, points, 1, 2, '#005eff');
    addPoints(svg, points, 2, 2, '#80ff00');
  };

  onMount(() => {
    draw(rotationX, rotationY);
  });

  let isDragging = false;
  const dragStart = () => {
    isDragging = true;
  };

  const dragEnd = (event: any) => {
    if (!isDragging) return;
    if (event.type !== 'mouseup') {
      if (typeof event.relatedTarget.className === 'string') {
        if (event.relatedTarget.className.includes('d3-3d')) {
          return;
        }
      } else {
        if (event.relatedTarget.className.baseVal.includes('d3-3d')) {
          return;
        }
      }
    }

    isDragging = false;
  };

  const drag = (event: any) => {
    if (!isDragging) return;

    const delta = {
      x: event.movementX,
      y: event.movementY,
    };

    rotationX += (delta.y * 0.05) / Math.PI;
    rotationY += (delta.x * 0.05) / Math.PI;
  };

  $: {
    draw(rotationX, rotationY);
  }
</script>

<svg
  id="here"
  class="d3-3d"
  width="300"
  height="300"
  on:mousedown={dragStart}
  on:mouseup={dragEnd}
  on:mousemove={drag}
  on:mouseout={dragEnd}
  on:mouseleave={dragEnd}
  on:blur={dragEnd} />
