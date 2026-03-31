/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { GestureID } from '../../../../core/entities/Gesture';
import type { NewGesture } from '../../../../core/entities/NewGesture';
import type { Recording } from '../../../../core/entities/recording/Recording';
import type { GestureRepository } from '../../GestureRepository';
import type { GestureService } from '../../GestureService';
import type { SystemColors } from '../SystemColors';
import { GestureImpl } from './GestureImpl';

export class GestureServiceImpl implements GestureService {
  public constructor(
    private gestureRepository: GestureRepository,
    private colors: SystemColors,
  ) {}

  deleteValidationRecording(gestureId: number, recordingId: number): void {
    const gesture = this.getGestureOrThrow(gestureId);
    gesture.setValidationRecordings(
      [...gesture.getValidationRecordings()].filter(rec => rec.getId() !== recordingId),
    );
    this.gestureRepository.saveGesture(gesture);
  }

  public getGestureFromRecording(recordingId: number): NewGesture | undefined {
    const gestures = this.gestureRepository.getGestures();
    for (const gesture of gestures) {
      const recordings = gesture.getRecordings();
      for (const recording of recordings) {
        if (recording.getId() === recordingId) {
          return gesture;
        }
      }
    }
    return undefined;
  }

  public saveGesture(gesture: NewGesture): void {
    this.gestureRepository.saveGesture(gesture);
  }

  public createGesture(name: string): NewGesture {
    const id = this.gestureRepository.generateGestureId();
    const gesture = new GestureImpl(
      id,
      name,
      [],
      [],
      {},
      this.colors.generateGestureColor(),
    );
    this.gestureRepository.saveGesture(gesture);
    return gesture;
  }

  public deleteRecording(gestureId: GestureID, recordingId: number): void {
    const gesture = this.getGestureOrThrow(gestureId);
    gesture.setRecordings(
      [...gesture.getRecordings()].filter(rec => rec.getId() !== recordingId),
    );
    this.gestureRepository.saveGesture(gesture);
  }

  public addRecording(gestureId: number, recording: Recording): void {
    const gesture = this.getGestureOrThrow(gestureId);
    gesture.setRecordings([...gesture.getRecordings(), recording]);
    this.gestureRepository.saveGesture(gesture);
  }

  public deleteGesture(gesture: GestureID): void {
    this.gestureRepository.removeGesture(gesture);
  }

  public setGestureName(gestureId: GestureID, name: string): void {
    const gesture = this.getGestureOrThrow(gestureId);
    gesture.setName(name);
    this.gestureRepository.saveGesture(gesture);
  }

  public getGesture(id: GestureID): NewGesture | undefined {
    return this.gestureRepository.getGesture(id);
  }

  public setGestures(value: NewGesture[]): void {
    this.gestureRepository.saveGestures(value);
  }

  public getGestures(): NewGesture[] {
    return this.gestureRepository.getGestures();
  }

  private getGestureOrThrow(gestureId: GestureID): NewGesture {
    const gesture = this.getGesture(gestureId);
    if (!gesture) {
      throw new Error(`Couldn't find gesture with id ${gestureId}`);
    }
    return gesture;
  }
}
