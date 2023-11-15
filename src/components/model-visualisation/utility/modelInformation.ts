import { get, writable, type Writable } from "svelte/store";
import { gestures } from '../../../script/stores/Stores';
import { state } from '../../../script/stores/uiStore';
import { settings, trainingState } from '../../../script/stores/mlStore';


export type ModelInformation = {
  amountOfParameters: number,
    amountOfGestures: number
    amountOfRecordings: number
    precision: number
    energy: number
}

export const modelInformation : Writable<ModelInformation> = writable({
  amountOfParameters: 0,
    amountOfGestures: 0,
    amountOfRecordings: 0,
    precision: 0,
    energy: 0,
})

/**
 * Subscribe to state and update modelInformation when state is not predicting anymore
 */
state.subscribe(newState => {
  if(!newState.isPredicting) return;

  const amountOfParameters = getAmountOfParameters(); // 1
  const amountOfGestures = get(gestures).length; // 2
  const amountOfRecordings = getAmountOfRecordings(); // 6

  modelInformation.set({
    amountOfParameters,
    precision: getPrecision(get(trainingState).loss),
    amountOfGestures,
    amountOfRecordings,
    energy: getEnergy(amountOfRecordings, amountOfParameters, amountOfGestures)
  });
});

/**
 * Calculate precision based on loss
 * @returns a number between 0 and 100 derived from loss
 */
function getPrecision(loss: number): number {
  return Math.floor(100 * Math.min(0.3 / loss, 10)) / 10;
}

function getAmountOfParameters(): number {
  // return get(settings).includedFilters.reduce(
  //   (sum, val) => sum + (val ? 3 : 0),
  //   0
  // );
  return 8*3;
}

function getAmountOfRecordings(): number {
  return get(gestures).reduce(
    (sum, gesture) => sum + gesture.recordings.length,
    0
  );
}

/**
 * Calculate a value branded Energy, that simulates the amount of energy a model uses over its lifetime
 * This includes amount of gestures, as it influences the size of the second layer of the model. It includes
 * Amounts of parameters, which influences the size of the first layer. Lastly, amount of recordings, which
 * influences the length of the training.
 * @param amountOfRecordings 
 * @param amountOfParameters 
 * @param amountOfGestures 
 * @returns a number derived from parameters to illustrate energy requirement of model
 */
function getEnergy(amountOfRecordings: number, amountOfParameters: number, amountOfGestures: number): number {
  return (
    Math.floor(
      ((get(settings).numEpochs + 200) *
        (amountOfRecordings + 12) *
        (amountOfParameters + 8) *
        (amountOfGestures + 3)) /
        759
    ) / 10
  );
}