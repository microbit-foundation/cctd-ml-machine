/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MakeCodeFrameDriver } from '@microbit/makecode-embed';

export class MakeCodeFrame {
  private iframe: Element;
  private frameDriver: MakeCodeFrameDriver;

  public constructor(iframe: Element, frameDriver: MakeCodeFrameDriver) {
    this.iframe = iframe;
    this.frameDriver = frameDriver;
  }

  public getIframe() {
    return this.iframe;
  }

  public getFrameDriver() {
    return this.frameDriver;
  }
}
