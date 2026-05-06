import { SmoothieChart, TimeSeries } from 'smoothie';
import StaticConfiguration from '../../../StaticConfiguration';

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

  constructor(
    private minValue: number,
    private maxValue: number,
    private recordingDuration: number,
  ) {}

  public setCanvas(canvas: HTMLCanvasElement, selectedAxes: { index: number }[]) {
    this.chart = this.createChart(canvas, selectedAxes);
  }

  public updateData(values: number[]) {
    const time = new Date().getTime();
    if (this.timeSeries.length !== values.length) {
      this.timeSeries = values.map(() => new TimeSeries() as TimeSeriesWithData);
      // If dimensions change, we might need to re-add time series to the chart
      // But usually this happens once on init.
    }
    this.timeSeries.forEach((ts, idx) => {
      const val = values[idx];
      ts.append(time, val, false);
    });
  }

  public recordingStarted(isRecording: boolean): void {
    if (!isRecording || this.blockRecordingStart) {
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

  public stop() {
    if (this.chart) {
      this.chart.stop();
    }
  }

  private createChart(canvas: HTMLCanvasElement, selectedAxes: { index: number }[]) {
    if (this.chart) {
      this.chart.stop();
    }
    const newChart = new SmoothieChart({
      maxValue: this.maxValue,
      minValue: this.minValue,
      millisPerPixel: 7,
      grid: {
        fillStyle: '#ffffff00',
        strokeStyle: 'rgba(48,48,48,0.20)',
        millisPerLine: 3000,
        borderVisible: false,
      },
      interpolation: 'linear',
    });

    this.timeSeries.forEach((ts, idx) => {
      if (selectedAxes.some(e => e.index === idx)) {
        const color = this.axisColors[idx];
        newChart.addTimeSeries(ts, {
          strokeStyle: color,
        });
      }
    });

    newChart.addTimeSeries(this.recordLines, {
      lineWidth: 3,
      strokeStyle: '#4040ff44',
      fillStyle: '#0000ff07',
    });

    newChart.streamTo(canvas, 0);
    return newChart;
  }
}
