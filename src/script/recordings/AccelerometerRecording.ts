import Recording from "../domain/Recording";
import { MicrobitAccelerometerData } from "../livedata/MicrobitAccelerometerData";

class AccelerometerRecording implements Recording<MicrobitAccelerometerData[]> {
    getId(): number {
        throw new Error("Method not implemented.");
    }
    getData(): MicrobitAccelerometerData[] {
        throw new Error("Method not implemented.");
    }
}

export default AccelerometerRecording;