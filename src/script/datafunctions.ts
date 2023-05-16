export interface FilterOutput {
  computeOutput(data: number[]): number;
}

export class MeanFilter implements FilterOutput {
  computeOutput(data: number[]): number {
    return data.reduce((a, b) => a + b) / data.length;
  }
}

export class SDFilter implements FilterOutput {
  computeOutput(data: number[]): number {
    const mean = data.reduce((a, b) => a + b) / data.length;
    return Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);
  }
}

export class RootMeanSquareFilter implements FilterOutput {
  computeOutput(data: number[]): number {
    const res =  Math.sqrt(data.reduce((a, b) => a + Math.pow(b, 2), 0) / data.length);
    return res;
  }
}

export class ZeroCrossingRateFilter implements FilterOutput {
  computeOutput(data: number[]): number {
    let count = 0;
    for (let i = 1; i < data.length; i++) { 
      if ((data[i] >= 0 && data[i - 1] < 0) || (data[i] < 0 && data[i - 1] >= 0)) {
        count++;
      }
    }
    return count / (data.length - 1);
  }
}

export class TotalAccFilter implements FilterOutput {
  computeOutput(data: number[]): number {
    return data.reduce((a, b) => a + Math.abs(b));
  }
}

export class MaxFilter implements FilterOutput {
  computeOutput(data: number[]): number {
    return Math.max(...data);
  }
}

export class MinFilter implements FilterOutput {
  computeOutput(data: number[]): number {
    return Math.min(...data);
  }
}

export class PeaksFilter implements FilterOutput {
  computeOutput(data: number[]): number {
    const lag = 5;
    const threshold = 3.5;
    const influence = 0.5;
  
    let peaksCounter = 0;
  
    if (data === undefined || data.length < lag + 2) {
      throw ` ## y data array to short(${data.length}) for given lag of ${lag}`;
    }
  
    // init variables
    const signals = Array(data.length).fill(0) as number[];
    const filteredY = data.slice(0);
    const lead_in = data.slice(0, lag);
  
    const avgFilter: number[] = [];
    avgFilter[lag - 1] = mean(lead_in);
    const stdFilter: number[] = [];
    stdFilter[lag - 1] = stddev(lead_in);
  
    for (let i = lag; i < data.length; i++) {
      if (
        Math.abs(data[i] - avgFilter[i - 1]) > 0.1 &&
        Math.abs(data[i] - avgFilter[i - 1]) > threshold * stdFilter[i - 1]
      ) {
        if (data[i] > avgFilter[i - 1]) {
          signals[i] = +1; // positive signal
          if (i - 1 > 0 && signals[i - 1] == 0) {
            peaksCounter++;
          }
        } else {
          signals[i] = -1; // negative signal
        }
        // make influence lower
        filteredY[i] = influence * data[i] + (1 - influence) * filteredY[i - 1];
      } else {
        signals[i] = 0; // no signal
        filteredY[i] = data[i];
      }
  
      // adjust the filters
      const y_lag = filteredY.slice(i - lag, i);
      avgFilter[i] = mean(y_lag);
      stdFilter[i] = stddev(y_lag);
    }
    return peaksCounter;
  }
}

export function mean(a: number[]): number {
  return a.reduce((acc, val) => acc + val) / a.length;
}

function stddev(arr: number[]): number {
  const arr_mean = mean(arr);
  const r = function (acc: number, val: number) {
    return acc + (val - arr_mean) * (val - arr_mean);
  };
  return Math.sqrt(arr.reduce(r, 0.0) / arr.length);
}


