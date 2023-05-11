/**
 * Document contains a bunch of data functions used for the ml.ts document
 * These merely support the ml-algorithm extracting data from data captured over time
 */

function average(data: number[]): number {
  const sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  const avg = sum / data.length;
  return avg;
}

export function variance(values: number[]): number {
  const avg = average(values);

  const squareDiffs = values.map(function (value) {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);

  return avgSquareDiff;
}

export function standardDeviation(values: number[]): number {
  const avg = average(values);

  const squareDiffs = values.map(function (value) {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);

  const stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

export function rootMeanSquare(values: number[]): number {
  const squareDiffs = values.map(function (value) {
    const sqrDiff = value * value;
    return sqrDiff;
  });
  return Math.sqrt(average(squareDiffs));
}

export function totalAcceleration(data: number[]): number {
  return data.reduce((sum, val) => sum + Math.abs(val));
}

function sum(a: number[]): number {
  return a.reduce((acc, val) => acc + val);
}

export function mean(a: number[]): number {
  return sum(a) / a.length;
}

function stddev(arr: number[]): number {
  const arr_mean = mean(arr);
  const r = function (acc: number, val: number) {
    return acc + (val - arr_mean) * (val - arr_mean);
  };
  return Math.sqrt(arr.reduce(r, 0.0) / arr.length);
}

// peak detection from https://stackoverflow.com/questions/22583391/peak-signal-detection-in-realtime-timeseries-data/57889588#57889588
export function peaks(
  y: number[],
  params?: { lag?: number; threshold?: number; influence?: number },
) {
  const p = params || {};
  // init cooefficients
  const lag = p.lag || 5;
  const threshold = p.threshold || 3.5;
  const influence = p.influence || 0.5;

  let peaksCounter = 0;

  if (y === undefined || y.length < lag + 2) {
    throw ` ## y data array to short(${y.length}) for given lag of ${lag}`;
  }

  // init variables
  const signals = Array(y.length).fill(0) as number[];
  const filteredY = y.slice(0);
  const lead_in = y.slice(0, lag);
  // console.log("1: " + lead_in.toString())

  const avgFilter: number[] = [];
  avgFilter[lag - 1] = mean(lead_in);
  const stdFilter: number[] = [];
  stdFilter[lag - 1] = stddev(lead_in);
  // console.log("2: " + stdFilter.toString())

  for (let i = lag; i < y.length; i++) {
    // added in Math.abs(y[i] - avgFilter[i - 1]) > 0.1 to account for peak detection when differences are very small
    if (
      Math.abs(y[i] - avgFilter[i - 1]) > 0.1 &&
      Math.abs(y[i] - avgFilter[i - 1]) > threshold * stdFilter[i - 1]
    ) {
      if (y[i] > avgFilter[i - 1]) {
        signals[i] = +1; // positive signal
        if (i - 1 > 0 && signals[i - 1] == 0) {
          peaksCounter++;
        }
      } else {
        signals[i] = -1; // negative signal
      }
      // make influence lower
      filteredY[i] = influence * y[i] + (1 - influence) * filteredY[i - 1];
    } else {
      signals[i] = 0; // no signal
      filteredY[i] = y[i];
    }

    // adjust the filters
    const y_lag = filteredY.slice(i - lag, i);
    avgFilter[i] = mean(y_lag);
    stdFilter[i] = stddev(y_lag);
  }
  return { numPeaks: peaksCounter, results: signals };
}
