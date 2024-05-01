/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { gridPlanes3D, points3D, lines3D } from 'd3-3d';
import { classifier, gestures } from '../../../script/stores/Stores';
import StaticConfiguration from '../../../StaticConfiguration';
import { knnHighlightedPoint } from './KnnPointToolTip';
import {
  Point3D,
  Point3DTransformed,
  distanceBetween,
} from '../../../script/utils/graphUtils';

export type GraphDrawConfig = {
  xRot: number;
  yRot: number;
  zRot: number;
  origin: { x: number; y: number };
  scale: number;
};

export type GrahpDrawData = {
  points: Point3D[];
};

export type DrawablePoint = {
  pointTransformed: Point3DTransformed;
  color: string;
  id: string;
};

class KNNModelGraphDrawer {
  private drawnTrainingPoints: Point3DTransformed[] = [];

  constructor(
    private svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    private classId: string,
  ) {}

  public drawLiveData = (drawConfig: GraphDrawConfig, drawData: Point3D) => {
    if (isNaN(drawData.y)) {
      return;
    }
    const pointTransformer = this.getPointTransformer(drawConfig);
    const color = StaticConfiguration.gestureColors[gestures.getNumberOfGestures()];
    const drawableLivePoint: DrawablePoint = {
      pointTransformed: pointTransformer(drawData),
      color,
      id: `live`,
    };

    this.addPoint(drawableLivePoint, 'live');

    // Draw lines from live point to the nearest neighbours
    const predictedPoints = [...this.drawnTrainingPoints]
      .sort((a, b) => {
        const aDist = distanceBetween(drawableLivePoint.pointTransformed, a);
        const bDist = distanceBetween(drawableLivePoint.pointTransformed, b);
        return aDist - bDist;
      })
      .slice(0, StaticConfiguration.knnNeighbourCount);

    const lines = this.svg.selectAll(`line.points-class`).data(predictedPoints);
    lines
      .enter()
      .append('line')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .merge(lines)
      .attr('x1', d => drawableLivePoint.pointTransformed.projected.x)
      .attr('y1', d => drawableLivePoint.pointTransformed.projected.y)
      .attr('x2', d => d.projected.x)
      .attr('y2', d => d.projected.y)
      .attr('class', `${this.classId} points-class`)
      .attr('stroke', '#1a1a1a');
    lines.exit().remove();
  };

  public draw(drawConfig: GraphDrawConfig, drawData: Point3D[][][]) {
    // this.svg.selectAll('*').remove(); // clear svg for redraw
    // Add grid
    this.addGrid(drawConfig);

    // Add axes
    this.addAxis(
      { x: 1, y: 0, z: 0 },
      'xScale',
      drawConfig,
      StaticConfiguration.liveGraphColors[0],
    );
    this.addAxis(
      { x: 0, y: 1, z: 0 },
      'yScale',
      drawConfig,
      StaticConfiguration.liveGraphColors[1],
    );
    if (classifier.getFilters().count() === 3) {
      // 3d, draw z-axis (forward/backward)
      this.addAxis(
        { x: 0, y: 0, z: 1 },
        'zScale',
        drawConfig,
        StaticConfiguration.liveGraphColors[2],
      );
    }
    const drawablePoints: DrawablePoint[] = [];

    const pointTransformer = this.getPointTransformer(drawConfig);

    // Add points
    drawData.forEach((clazz, classIndex) => {
      clazz.forEach((sample, exampleIndex) => {
        sample.forEach((axisValue, axisIndex) => {
          const color = StaticConfiguration.gestureColors[classIndex];
          const transformedPoint: Point3DTransformed = pointTransformer(axisValue);
          this.drawnTrainingPoints.push(transformedPoint);
          drawablePoints.push({
            pointTransformed: transformedPoint,
            color,
            id: `${classIndex}-${exampleIndex}-${axisIndex}`,
          });
        });
      });
    });
    this.addPoints(drawablePoints, drawConfig);
  }

  /**
   * Adds an array of points to the svg
   */
  private addPoints(points: DrawablePoint[], drawConfig: GraphDrawConfig) {
    const gPoints = this.svg.selectAll(`circle.points-class`).data(points);
    gPoints
      .enter()
      .append('circle')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .merge(gPoints)
      .attr('class', `${this.classId} points-class`)
      .attr('fill', el => el.color)
      .attr('stroke', '#1a1a1a')
      .attr('cx', d =>
        isNaN(d.pointTransformed.projected.x) ? 0 : d.pointTransformed.projected.x,
      )
      .attr('cy', d =>
        isNaN(d.pointTransformed.projected.y) ? 0 : d.pointTransformed.projected.y,
      )
      .attr('r', 3)
      .on('mouseenter', (event, projectedPoint) => {
        knnHighlightedPoint.set(projectedPoint);
      })
      .on('mouseleave', () => {
        knnHighlightedPoint.set(undefined);
      });
    gPoints.exit().remove();
  }

  /**
   * Adds a single 3D point projected onto the svg.
   */
  private addPoint(point: DrawablePoint, key: string) {
    const radius = 3;

    this.svg.select(`circle.points-class-${key}`).remove();
    const samplePoint = this.svg.selectAll(`circle.points-class-`).data([point]);
    samplePoint
      .enter()
      .append('circle')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .merge(samplePoint)
      .attr('class', `${this.classId} points-class-${key}`)
      .attr('fill', p => p.color)
      .attr('stroke', '#1a1a1a')
      .attr('cx', d =>
        isNaN(d.pointTransformed.projected.x) ? 0 : d.pointTransformed.projected.x,
      )
      .attr('cy', d =>
        isNaN(d.pointTransformed.projected.y) ? 0 : d.pointTransformed.projected.y,
      )
      .attr('r', radius)
      .on('mouseenter', (event, projectedPoint) => {
        knnHighlightedPoint.set(projectedPoint);
      })
      .on('mouseleave', () => {
        knnHighlightedPoint.set(undefined);
      });
    samplePoint.exit().remove();
  }

  private addAxis(
    direction: Point3D,
    className: string,
    drawConfig: GraphDrawConfig,
    color: string,
  ) {
    const lineLength = 20;
    const point1: Point3D = {
      x: (-direction.x * lineLength) / 2,
      y: (-direction.y * lineLength) / 2,
      z: (-direction.z * lineLength) / 2,
    };

    const point2: Point3D = {
      x: (direction.x * (lineLength - 2)) / 2,
      y: (direction.y * (lineLength - 2)) / 2,
      z: (direction.z * (lineLength - 2)) / 2,
    };

    const lineTranformer = this.getLineTransformer(drawConfig);
    const lineProjected: Point3DTransformed[] = lineTranformer([[point1, point2]]).points;
    const axis = this.svg.selectAll('line.' + className).data([lineProjected]);
    axis
      .enter()
      .append('line')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .merge(axis)
      .attr('class', `${this.classId} ` + className)
      .attr('x1', (data: Point3DTransformed[]) => data[0].projected.x)
      .attr('y1', (data: Point3DTransformed[]) => data[0].projected.y)
      .attr('x2', (data: Point3DTransformed[]) => data[1].projected.x)
      .attr('y2', (data: Point3DTransformed[]) => data[1].projected.y)
      .attr('stroke', color)
      .attr('stroke-width', 1);

    axis.exit().remove();
  }

  /**
   * Returns the label by using index to find element in list of gestures
   */
  private getLabel(dataIndex: number) {
    try {
      const gestureList = gestures.getGestures();
      return gestureList[dataIndex].getName();
    } catch (error) {
      // Index out of bounds indicates either an error or live data.
      return 'Live';
    }
  }

  private addGrid(drawConfig: GraphDrawConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const grid3d = this.getGridTransformer(drawConfig);
    const xGrid = [];
    const j = 10;
    for (let z = -j; z < j; z++) {
      for (let x = -j; x < j; x++) {
        if (classifier.getFilters().count() === 2) {
          xGrid.push({ x: x, y: z, z: 0 }); // Draw grid vertically (2d)
        } else {
          xGrid.push({ x: x, y: 0, z: z }); // Draw grid horizontally (3d)
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const gridData = grid3d(xGrid);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    const grid = this.svg.selectAll('path.grid').data(gridData, (d: any) => d.id);

    grid
      .enter()
      .append('path')
      .lower()
      .attr('class', `${this.classId} grid`)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .merge(grid)
      .attr('stroke', 'black')
      .attr('stroke-width', 0.3)
      .attr('fill', d => '#eee')
      .attr('fill-opacity', 0.9)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      .attr('d', grid3d.draw);

    grid.exit().remove();
  }

  private getPointTransformer(
    drawConfig: GraphDrawConfig,
  ): (point: Point3D) => Point3DTransformed & { centroid: Point3D } {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return (_point: Point3D) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      this.getBaseTransformer(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        points3D(),
        drawConfig,
      )([_point as unknown as Point3D[]])[0];
  }

  private getLineTransformer(
    drawConfig: GraphDrawConfig,
  ): (point: Point3D[][]) => { centroid: Point3D; points: Point3DTransformed[] } {
    return (points: Point3D[][]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const transformed = this.getBaseTransformer(lines3D(), drawConfig)(points)[0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const { centroid, ...transformedPoints } = transformed;
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        centroid,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        points: transformedPoints,
      };
    };
  }

  private getGridTransformer(drawConfig: GraphDrawConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return gridPlanes3D()
      .rows(20)
      .rotateX(drawConfig.xRot)
      .rotateY(drawConfig.yRot)
      .rotateZ(drawConfig.zRot)
      .origin(drawConfig.origin)
      .scale(drawConfig.scale);
  }

  private getBaseTransformer(
    transformer: any,
    drawConfig: GraphDrawConfig,
  ): (point: Point3D[][]) => any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return transformer
      .rotateX(drawConfig.xRot)
      .rotateY(drawConfig.yRot)
      .rotateZ(drawConfig.zRot)
      .origin(drawConfig.origin)
      .scale(drawConfig.scale) as (point: Point3D[][]) => any;
  }
}

export default KNNModelGraphDrawer;
