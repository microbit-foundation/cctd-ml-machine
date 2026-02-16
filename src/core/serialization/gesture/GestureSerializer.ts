import type { NewGesture } from "../../entities/NewGesture";
import type { Recording } from "../../entities/recording/Recording";
import { RecordingImpl } from "../../entities/recording/RecordingImpl";
import { Sample } from "../../entities/recording/Sample";
import { GestureImpl } from "../../../backend/domain/implementation/gesture/GestureImpl";
import type { SerializedGesture } from "./SerializedGesture";
import type { SerializedRecording } from "./SerializedRecording";

export class GestureSerializer {
  public serialize(gesture: NewGesture): SerializedGesture {
    return {
      ID: gesture.getID(),
      name: gesture.getName(),
      output: gesture.getOutput(),
      color: gesture.getColor(),
      recordings: this.mapRecordingsToSerialized(gesture.getRecordings()),
      validationRecordings: this.mapRecordingsToSerialized(gesture.getValidationRecordings()),
    };
  }

  private mapRecordingsToSerialized(recordings: Recording[]): SerializedRecording[] {
    return recordings.map(rec => ({
      ID: rec.getId(),
      samples: rec.getSamples().map(sample => ({ vector: sample.getValue() })),
      axes: rec.getAxes(),
    }));
  }

  private mapSerializedRecordings(serialized: SerializedRecording[]): Recording[] {
    return serialized.map(rec => {
      return new RecordingImpl(
        rec.ID,
        rec.samples.map(sample => new Sample(sample.vector)),
        rec.axes
      );
    });
  }

  public deserialize(serializedGesture: SerializedGesture): NewGesture {

    const recordings: Recording[] = this.mapSerializedRecordings(serializedGesture.recordings)
    const validationRecordings: Recording[] = this.mapSerializedRecordings(serializedGesture.validationRecordings)

    return new GestureImpl(
        serializedGesture.ID,
        serializedGesture.name,
        recordings,
        validationRecordings,
        serializedGesture.output,
        serializedGesture.color,
    )
  }
}