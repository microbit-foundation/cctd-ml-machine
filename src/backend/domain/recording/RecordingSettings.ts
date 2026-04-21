export class RecordingSettings {
        constructor(private recordingDuration: number, private minNoOfSamples: number) {
        }

        getRecordingDuration(): number {
                return this.recordingDuration;
        }

        getMinNoOfSamples(): number {
                return this.minNoOfSamples;
        }
}