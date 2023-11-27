export type TimestampedData<T> = {
    value:T,
    timestamp: number,
}
class LiveDataBuffer<T> {
    private buffer: TimestampedData<T>[]
    private bufferPtr = 0;
    constructor(private maxLen: number) {
        this.buffer = new Array<TimestampedData<T>>(maxLen).fill(null!);
    }

    public addValue(value: T) {
        const bufferIndex = this.getBufferIndex();
        this.bufferPtr++;
        this.buffer[bufferIndex] = {
            timestamp: Date.now(),
            value: value
        };
    }

    public getSeries(time: number, noOfElements: number) {
        let searchPointer = this.bufferPtr;
        // Search for elements that fit the time frame
        const series = []
        const dateStart = Date.now();
        let i = 0;
        while(i < this.maxLen) {
            const element = this.buffer[this.getBufferIndexFrom(searchPointer - 1)];
            if (!element) {
                console.warn("Found nulll element")
                break;
            }
            const timeElapsed = dateStart - element.timestamp;
            if (timeElapsed > time) {
                break;
            }
            series.push(element);
            searchPointer--;
            i++;
        }

        // Now the series array is filled with elements within the timeframe. 
        // We should now find `noOfElements` number of items to return
        if (series.length < noOfElements) {
            console.error("Insufficient buffer data! Maybe try increasing the buffer size")
        }
        if (series.length > 10 * noOfElements) {
            console.warn("The number of values in LiveDataBuffer, that fit the timeframe is greater than 1000%! Maybe decrease the polling frequency or increase the number of elements fetched from buffer to improve performance")
        }

        // We will spread out the values evenly and return the result
        const resultSeries = []
        for (let i = 0; i < noOfElements; i++) {
            const index = Math.floor(series.length / noOfElements) * i
            resultSeries.push(series[index])
        }
        return resultSeries;
    }

    private getBufferIndex(): number {
        return this.getBufferIndexFrom(this.bufferPtr);
    }

    private getBufferIndexFrom(index: number): number {
        return index % this.maxLen;
    }
}

export default LiveDataBuffer;
