/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { MBSpecs } from 'microbyte';
import Microbits from './Microbits';
import InputMicrobitHandler from './InputMicrobitHandler';
import OutputMicrobitHandler from './OutputMicrobitHandler';

class CombinedMicrobitHandler extends InputMicrobitHandler {
  public constructor(private outputHandler: OutputMicrobitHandler) {
    super();
  }

  public onConnected(versionNumber?: MBSpecs.MBVersion | undefined): void {
    super.onConnected(versionNumber);
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onConnected();
    }
  }

  public onAccelerometerDataReceived(x: number, y: number, z: number): void {
    super.onAccelerometerDataReceived(x, y, z);
  }

  public onButtonAPressed(state: MBSpecs.ButtonState): void {
    super.onButtonAPressed(state);
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onButtonAPressed(state);
    }
  }

  public onButtonBPressed(state: MBSpecs.ButtonState): void {
    super.onButtonBPressed(state);
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onButtonBPressed(state);
    }
  }

  public onClosed(): void {
    super.onClosed();
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onClosed();
    }
  }

  public onClosedError(error: Error): void {
    super.onClosedError(error);
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onClosedError(error);
    }
  }

  public onConnectError(error: Error): void {
    super.onConnectError(error);
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onConnectError(error);
    }
  }

  public onConnecting(): void {
    super.onConnecting();
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onConnecting();
    }
  }

  public onDisconnected(): void {
    super.onDisconnected();
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onDisconnected();
    }
  }

  public onMessageReceived(data: string): void {
    super.onMessageReceived(data);
  }

  public onReconnectError(error: Error): void {
    super.onReconnectError(error);
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onReconnectError(error);
    }
  }

  public onReconnected(): void {
    super.onReconnected();
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onReconnected();
    }
  }

  public onReconnecting(): void {
    super.onReconnecting();
    if (Microbits.isInputOutputTheSame()) {
      this.outputHandler.onReconnecting();
    }
  }
}

export default CombinedMicrobitHandler;
