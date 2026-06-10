import type { NewGesture } from '../../../core/entities/NewGesture';

export interface GestureListListener {
  onGesturesChanged(gestures: NewGesture[]): void;
}
