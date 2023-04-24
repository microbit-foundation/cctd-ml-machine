import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import CookieManager from './script/CookieManager';

const load = () => {
  if (CookieManager.getComplianceChoices().analytics) {
    appInsights.loadAppInsights();
    appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
  }
};
const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      'InstrumentationKey=a475fa05-ab5e-4a01-82a0-0a1b58af45da;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/',
  },
});

load();

document.addEventListener('complianceCookieChange', load);
