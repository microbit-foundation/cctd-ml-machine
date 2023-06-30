import type ConnectionBehaviour from '../../script/connection-behaviours/ConnectionBehaviour';
import MicrobitBluetooth from '../../script/microbit-interfacing/MicrobitBluetooth';
import MBSpecs from '../../script/microbit-interfacing/MBSpecs';

/**
 * Use this for checking the micro:bit behaviour.
 */
class SpyConnectionBehaviour implements ConnectionBehaviour {
  private hasConnected = false;
  private hasDisconnected = false;
  private wasExpelled = false;
  private wasManualExpel = false;
  private wasBothExpelled = false;
  private hasFailedConnection = false;
  private connectedName: string | undefined = undefined;
  private connectedMicrobit: MicrobitBluetooth | undefined = undefined;

  onConnected(name: string): void {
    this.hasConnected = true;
  }
  onDisconnected(): void {
    this.hasDisconnected = true;
  }

  accelerometerChange(x: number, y: number, z: number): void {}

  onAssigned(microbitBluetooth: MicrobitBluetooth, name: string): void {
    this.hasConnected = true;
    this.connectedName = name;
    this.connectedMicrobit = microbitBluetooth;
  }

  onCancelledBluetoothRequest(): void {
    this.hasFailedConnection = true;
  }

  onExpelled(manual?: boolean, bothExpelled?: boolean): void {
    this.wasExpelled = true;
    if (manual) {
      this.wasManualExpel = manual;
    }
    if (bothExpelled) {
      this.wasBothExpelled = bothExpelled;
    }
  }

  buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {}

  isAssigned(): boolean {
    return false;
  }

  wasBothDisconnected(): boolean {
    return this.wasBothExpelled;
  }

  wasManuallyDisconnected(): boolean {
    return this.wasManualExpel;
  }

  hasConnectFired() {
    return this.hasConnected;
  }

  wasDisconnected() {
    return this.hasDisconnected;
  }

  didFailConnection() {
    return this.hasFailedConnection;
  }

  getConnectedName() {
    return this.connectedName;
  }

  onReady(): void {}

  onBluetoothConnectionError(error?: unknown): void {
    this.hasFailedConnection = true;
  }
}

export default SpyConnectionBehaviour;
