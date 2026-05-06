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
        this.log.log('Initializing LiveGraphControl with minValue:', minValue, 'maxValue:', maxValue, 'recordingDuration:', recordingDuration);
        this.smoothedLiveData = new SmoothedLiveData<LiveDataVector>(liveData, 3);
    }

    public setCanvas(canvas: HTMLCanvasElement, selectedAxes: Axis[]) {
        this.selectedAxes = selectedAxes;

        this.stop();
        this.updateChart(canvas);
        this.start();
    }

    public getSmoothedLiveData() {
        return this.smoothedLiveData;
    }

    public updateData(values: number[]) {
        const time = new Date().getTime();
        const filteredValues = this.selectedAxes.map(axis => values[axis.index]);
        this.timeSeries.forEach((ts, idx) => {
            const val = filteredValues[idx];
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
        if (this.dataUnsubscriber) {
            this.dataUnsubscriber();
            this.dataUnsubscriber = undefined;
        }
        if (this.chart) {
            this.chart.stop();
        }
    }

    public start() {
        if (this.chart) {
            this.chart.start();
        }
        this.dataUnsubscriber = this.smoothedLiveData.subscribe(values => {
            this.log.log('Updating data for live graph', values);
            this.updateData(values.getValue());
        });
    }

    private updateChart(canvas: HTMLCanvasElement) {
        this.log.log('Updating chart with new canvas');
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
