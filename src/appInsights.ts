/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import CookieManager from './script/CookieManager';

const load = () => {
  // Do not load if the connection string is not set. E.g. in local development
  if (process.env.APP_INSIGHTS_INSTRUMENTATION_KEY === undefined || process.env.APP_INSIGHTS_INSTRUMENTATION_KEY === '') {
    return;
  }
  if (CookieManager.getComplianceChoices().analytics) {
    appInsights.loadAppInsights();
    appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
  }
};
export const appInsights = new ApplicationInsights({
  config: {
    connectionString:
    process.env.APP_INSIGHTS_INSTRUMENTATION_KEY, // Add this environment variable to enable AppInsights 
    },
});

load();

document.addEventListener('complianceCookieChange', load);
