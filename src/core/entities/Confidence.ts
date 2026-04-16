/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
/**
 * @deprecated Replace with only the required confidence as a setting. Use Confidences from the ConfidenceService instead.
 */
export interface Confidence {
  currentConfidence: number;
  requiredConfidence: number;
  isConfident: boolean;
}
