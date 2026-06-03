import { SmoothieChart, TimeSeries } from 'smoothie';
import StaticConfiguration from '../../../StaticConfiguration';
import { getControllers } from '../../../backend/interface-adapter/MLMachine';
import ConsoleLogger from '../../../core/logging/ConsoleLogger';
import type { LiveDataStore } from '../../../core/LiveDataStore';
import type { LiveDataVector } from '../../../core/vector/LiveDataVector';
import SmoothedLiveData from '../../../lib/livedata/SmoothedLiveData';
import type { AbstractState } from '../../../backend/statemanagement/AbstractState';
import type { Unsubscriber } from '../../../backend/statemanagement/AbstractReadonlyState';
import type { Axis } from '../../../core/entities/Axis';

/**
 * TimesSeries, but with the data array added.
 * `data[i][0]` is the timestamp,
 * `data[i][1]` is the value,
 */
type TimeSeriesWithData = TimeSeries & { data: number[][] };

export class LiveGraphControl {
  private chart: SmoothieChart | undefined;
  private timeSeries: TimeSeriesWithData[] = [];
  private recordLines = new TimeSeries();
  private blockRecordingStart = false;
  private axisColors = StaticConfiguration.graphColors;
  private log = new ConsoleLogger(LiveGraphControl.name);
  private smoothedLiveData: SmoothedLiveData<LiveDataVector>;
  private dataUnsubscriber: Unsubscriber | undefined;
  private selectedAxes: Axis[] = [];

  constructor(
    private minValue: number,
    private maxValue: number,
    private recordingDuration: number,
    liveData: AbstractState<LiveDataStore<LiveDataVector>>,
  ) {
    this.log.info(
      'Initializing LiveGraphControl with minValue:',
      minValue,
      'maxValue:',
      maxValue,
      'recordingDuration:',
      recordingDuration,
    );
    this.smoothedLiveData = new SmoothedLiveData<LiveDataVector>(liveData, 3);
  }

  /**
   * Sets the canvas element for the chart and the axes to display. This will stop the current chart (if any), create a new one with the specified axes, and start it.
   */
  public setCanvas(canvas: HTMLCanvasElement, selectedAxes: Axis[]) {
    this.selectedAxes = selectedAxes;

    this.stop();
    this.updateChart(canvas);
    this.start();
  }

  /**
   * Returns the SmoothedLiveData instance used by this control. This can be used to subscribe to live data updates or to access the current smoothed values.
   */
  public getSmoothedLiveData() {
    return this.smoothedLiveData;
  }

  public recordingStarted(): void {
    if (this.blockRecordingStart) {
      return;
    }

    const startTime = new Date().getTime();
    this.recordLines.append(startTime - 1, this.minValue, false);
    this.recordLines.append(startTime, this.maxValue, false);

    this.blockRecordingStart = true;
    setTimeout(() => {
      const endTime = new Date().getTime();
      this.recordLines.append(endTime - 1, this.maxValue, false);
      this.recordLines.append(endTime, this.minValue, false);
      this.blockRecordingStart = false;
    }, this.recordingDuration);
  }

  /**
   * Stops the live graph by unsubscribing from the smoothed live data and stopping the chart. This will halt any updates to the chart until `start()` is called again.
   */
  public stop() {
    if (this.dataUnsubscriber) {
      this.dataUnsubscriber();
      this.dataUnsubscriber = undefined;
    }
    if (this.chart) {
      this.chart.stop();
    }
  }

  /**
   * Starts the live graph by subscribing to the smoothed live data and updating the chart whenever new data is available. This method should be called after setting the canvas and axes to begin displaying live data on the chart.
   */
  public start() {
    if (this.chart) {
      this.chart.start();
    }
    this.dataUnsubscriber = this.smoothedLiveData.subscribe(values => {
      this.updateData(values.getValue());
    });
  }

  /**
   * Updates the chart with new data values. This method is called whenever new smoothed live data is available. It filters the incoming values based on the selected axes and appends them to the corresponding time series for display on the chart.
   */
  private updateData(values: number[]) {
    const time = new Date().getTime();
    const filteredValues = this.selectedAxes.map(axis => values[axis.index]);
    this.timeSeries.forEach((ts, idx) => {
      const val = filteredValues[idx];
      ts.append(time, val, false);
    });
  }

  private updateChart(canvas: HTMLCanvasElement) {
    this.log.info('Updating chart with new canvas');
    if (this.chart) {
      this.chart.stop();
    }
    this.timeSeries = this.selectedAxes.map(() => new TimeSeries() as TimeSeriesWithData);
    const newChart = new SmoothieChart({
      maxValue: this.maxValue,
      minValue: this.minValue,
      millisPerPixel: 7,
      grid: {
        fillStyle: '#ffffff00',
        strokeStyle: 'rgba(90, 90, 90, 0.2)',
        millisPerLine: 3000,
        borderVisible: false,
      },
      interpolation: 'linear',
    });

    this.selectedAxes.forEach((axis, idx) => {
      const color = this.axisColors[axis.index];
      newChart.addTimeSeries(this.timeSeries[idx], {
        strokeStyle: color,
      });
    });

    newChart.addTimeSeries(this.recordLines, {
      lineWidth: 3,
      strokeStyle: '#4040ff44',
      fillStyle: '#0000ff07',
    });

    newChart.streamTo(canvas, 0);
    this.chart = newChart;
  }
}
