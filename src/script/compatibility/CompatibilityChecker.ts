import Bowser from 'bowser';
import {
  nonAllowedPlatforms,
  type SemVer,
  SemVerImpl,
  WebBluetoothCompatibility as BTComp,
  WebUSBCompatibility as USBComp,
} from './CompatibilityList';
import Environment from '../Environment';

export type CompatibilityStatus = {
  bluetooth: boolean;
  usb: boolean;
  platformAllowed: boolean;
  webGL: boolean
};

// TODO: Why is this a class? No constructor, no internal state, and only
// a single static method. Might as well just be a function?
class CompatibilityChecker {
  public static checkCompatibility(): CompatibilityStatus {
    if (localStorage.getItem('isTesting')) {
      return { bluetooth: true, usb: true, platformAllowed: true, webGL: true };
    }
    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowser().name ?? 'unknown';
    const osName = browser.getOS().name ?? 'unknown';

    const canvas = document.createElement("canvas")
    // TODO: Handle webgl1 vs webgl2 in relation to threejs
    const webGL = canvas.getContext("webgl") instanceof WebGLRenderingContext

    const browserVersion = browser.getBrowserVersion();
    if (!browserVersion) {
      return { bluetooth: false, usb: false, platformAllowed: true, webGL: webGL };
    }
    const majorVersion = browser.getBrowserVersion().split('.')[0];
    const minorVersion = browser.getBrowserVersion().split('.')[1];
    const semVer: SemVer = new SemVerImpl(majorVersion, minorVersion);
    const isBluetoothSupported = BTComp.isVersionSupported(browserName, semVer, osName);

    const isUsbSupported = USBComp.isVersionSupported(browserName, semVer, osName);
    let platformType = browser.getPlatform().type;

    // If platform won't report what it is, just assume desktop (ChromeOS doesnt report it)
    if (platformType == undefined) {
      platformType = 'desktop';
    }
    const isPlatformAllowed =
      Environment.isInDevelopment || !nonAllowedPlatforms.includes(platformType);

    return {
      bluetooth: isBluetoothSupported,
      usb: isUsbSupported,
      platformAllowed: isPlatformAllowed,
      webGL: webGL
    };
  }
}

export default CompatibilityChecker;
