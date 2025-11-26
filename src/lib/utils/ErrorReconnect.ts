/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { getControllers } from '../../backend/interface-adapter/MLMachine';
import { isInputPatternValid } from '../stores/connectionStore';

/**
 * Workaround for an unrecoverable reconnect failure due to a bug in chrome/chromium.
 * This error occurs, when a connection is established, but lost again before listening to the characteristics
 * Refresh the page is the only known solution
 */
export const onCatastrophicError = (reconnect?: boolean) => {
  // Set flag to offer reconnect when page reloads
  if (isInputPatternValid() && reconnect) {
    getControllers().getAppController().setReconnectFlag(true);
  }
  location.reload();
};
