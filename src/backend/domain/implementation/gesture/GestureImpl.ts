/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Confidence } from '../../../../core/entities/Confidence';
import type { GestureID } from '../../../../core/entities/Gesture';
import type { GestureOutput } from '../../../../core/entities/GestureOutput';
import type { NewGesture } from '../../../../core/entities/NewGesture';
import type { Recording } from '../../../../core/entities/recording/Recording';

export class GestureImpl implements NewGesture {
  public constructor(
    private id: GestureID,
    private name: string,
    private recordings: Recording[],
    private validationRecordings: Recording[],
    private ouput: GestureOutput,
    private color: string,
  ) {}

  setValidationRecordings(recordings: Recording[]): void {
    this.validationRecordings = recordings;
  }

  getValidationRecordings(): Recording[] {
    return this.validationRecordings;
  }
  setOutput(ouput: GestureOutput): void {
    this.ouput = ouput;
  }

  setRecordings(recordings: Recording[]): void {
    this.recordings = recordings;
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
  getID(): GestureID {
    return this.id;
  }
  getRecordings(): Recording[] {
    return this.recordings;
  }
  getOutput(): GestureOutput {
    return this.ouput;
  }
  getColor(): string {
    return this.color;
  }
  getConfidence(): Confidence {
    return {
      currentConfidence: 0,
      isConfident: false,
      requiredConfidence: 1,
    };
  }
}
