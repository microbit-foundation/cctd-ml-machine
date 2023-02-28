import Cookies from "js-cookie";

export type ComplianceChoices = {
	necessary: boolean;
	analytics: boolean;
}

/**
 * Handles the storage and access of cookie information in a GDPR-compliant manner
 */
class CookieManager {
	private static complianceCookieName = "cookie_consent";
	private static complianceCookieChangeEvent = new Event("complianceCookieChange");

	public static isComplianceSet(): boolean {
		return Cookies.get(this.complianceCookieName) !== undefined;
	}

	public static getComplianceChoices(): ComplianceChoices {
		if (!this.isComplianceSet()) {
			return {
				necessary: true,
				analytics: false
			};
		}
		return JSON.parse(Cookies.get(this.complianceCookieName)!) as ComplianceChoices;
	}

	public static setComplianceChoices(complianceChoices: ComplianceChoices): void {
		Cookies.set(this.complianceCookieName, JSON.stringify(complianceChoices), { expires: 365 });
		document.dispatchEvent(this.complianceCookieChangeEvent);
	}
}

export default CookieManager;