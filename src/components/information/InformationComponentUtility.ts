/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import windi from '../../../windi.config.js';
export const getInfoBoxColors = (isLightTheme: boolean) => {
  return {
    backgroundColor: isLightTheme
      ? windi.theme.extend.colors.infobglight
      : windi.theme.extend.colors.infobgdark,
    iconColor: isLightTheme
      ? windi.theme.extend.colors.infoiconlight
      : windi.theme.extend.colors.infoicondark,
    iconTextColor: isLightTheme
      ? windi.theme.extend.colors.infotextlight
      : windi.theme.extend.colors.infotextdark,
    textColor: isLightTheme
      ? windi.theme.extend.colors.primarytext
      : windi.theme.extend.colors.secondarytext,
  };
};
