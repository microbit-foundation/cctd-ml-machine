/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
/**
 * @deprecated Replace with only the required confidence as a setting. Use Confidences from the ConfidenceService instead.
 */
export interface Confidence {
  /**
   * @deprecated This is not used and should not be set. The confidence of the current prediction should be obtained from the ConfidenceService instead.
   */
  currentConfidence: number;
  requiredConfidence: number;
  /**
   * @deprecated This is not used and should not be set. The confidence of the current prediction should be obtained from the ConfidenceService instead.
   */
  isConfident: boolean;
}
