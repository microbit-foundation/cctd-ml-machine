import Cookies from 'js-cookie';

export type ComplianceChoices = {
  necessary: boolean;
  analytics: boolean;
};

/**
 * Handles the storage and access of cookie information in a GDPR-compliant manner
 */
class CookieManager {
  private static reconnectCookieName = 'reconnect_flag';
  private static complianceCookieName = 'cookie_consent';
  private static complianceCookieChangeEvent = new Event('complianceCookieChange');

  public static isReconnectFlagSet(): boolean {
    return Cookies.get(this.reconnectCookieName) !== undefined;
  }

  public static unsetReconnectFlag(): void {
    Cookies.remove(this.reconnectCookieName);
  }

  public static setReconnectFlag(): void {
    Cookies.set(this.reconnectCookieName, 'true');
  }

  public static isComplianceSet(): boolean {
    return Cookies.get(this.complianceCookieName) !== undefined;
  }

  public static getComplianceChoices(): ComplianceChoices {
    if (!this.isComplianceSet()) {
      return {
        necessary: true,
        analytics: false,
      };
    }
    return JSON.parse(Cookies.get(this.complianceCookieName)!) as ComplianceChoices;
  }

  public static setComplianceChoices(complianceChoices: ComplianceChoices): void {
    Cookies.set(this.complianceCookieName, JSON.stringify(complianceChoices), {
      expires: 365,
    });
    document.dispatchEvent(this.complianceCookieChangeEvent);
  }
}

export default CookieManager;
