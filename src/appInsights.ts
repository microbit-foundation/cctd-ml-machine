/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import CookieManager from './script/CookieManager';

const load = () => {
  if (location.hostname !== "ml-machine.org") {
    return;
  }
  if (CookieManager.getComplianceChoices().analytics) {
    appInsights.loadAppInsights();
    appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
  }
};
const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      'InstrumentationKey=9ff70ae9-1397-4b70-85f2-2d3e80a29113;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/',
  },
});

load();

document.addEventListener('complianceCookieChange', load);
