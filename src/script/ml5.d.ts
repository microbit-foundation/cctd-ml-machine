declare module 'ml5' {
  // This only includes declarations for what we are currently using.
  // If more of the ml5 library is used in the future, more declarations will be needed here
  export class ML5NeuralNetwork{
    train(options:object, whileTraining: (epoch: number, loss:{ val_loss: number, val_acc: number, loss: number, acc: number } ) => void, finishedTraining: () => void): any
    addData(inputs:object, output: object): void
    classify(input: object, handleResults: (error: string | undefined, result: {confidence: number, label: string}[]) => void): void
    normalizeData(): void
    data: {training: {xs: {[key: string]: number}, ys: {[key: string]: number}}[]}
    neuralNetworkData: any
    neuralNetwork: any
    save: any
  }

  export function neuralNetwork(options: object): ML5NeuralNetwork
}