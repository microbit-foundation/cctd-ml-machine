/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
/// <reference types="w3c-web-usb" />

import Bowser from 'bowser';
import { nonAllowedPlatforms } from './CompatibilityList';
import Environment from '../Environment';

export type CompatibilityStatus = {
  bluetooth: boolean;
  usb: boolean;
  platformAllowed: boolean;
  webGL: boolean;
};

export const checkCompatibility = async (): Promise<CompatibilityStatus> => {
  if (localStorage.getItem('isTesting')) {
    return { bluetooth: true, usb: true, platformAllowed: true, webGL: true };
  }
  const browser = Bowser.getParser(window.navigator.userAgent);

  const canvas = document.createElement('canvas');
  // TODO: Handle webgl1 vs webgl2 in relation to threejs
  const webGL = canvas.getContext('webgl') instanceof WebGLRenderingContext;

  const browserVersion = browser.getBrowserVersion();
  if (!browserVersion) {
    return { bluetooth: false, usb: false, platformAllowed: true, webGL: webGL };
  }

  const bluetoothNavigator = navigator.bluetooth;
  const isBluetoothSupported =
    bluetoothNavigator && (await navigator.bluetooth.getAvailability());

  const usbNavigator = navigator.usb;
  const isUsbSupported = !!usbNavigator;
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
    webGL: webGL,
  };
};
