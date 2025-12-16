/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  createMakeCodeURL,
  MakeCodeFrameDriver,
  type MakeCodeProject,
} from '@microbit/makecode-embed';
import { MakeCodeFrame } from './MakeCodeFrame';

/**
 * Builds the makecode frames needed for embedding makecode
 */
export class MakeCodeFrameBuilder {
  public constructor(private project: MakeCodeProject) {}

  public getFrame(onBack: () => void): MakeCodeFrame {
    const iframe = document.createElement('iframe');
    iframe.allow = 'usb; autoplay; camera; microphone;';
    iframe.src = createMakeCodeURL(
      'https://makecode.microbit.org',
      undefined, // Version.
      undefined, // Language.
      2, // Controller.
      undefined, // Query params.
    );

    iframe.width = '100%';
    iframe.height = '100%';

    // Create and initialise an instance of MakeCodeFrameDriver.
    const driverRef = new MakeCodeFrameDriver(
      {
        onBack,
        controllerId: 'MlMachine',
        initialProjects: async () => [this.project],
        // When the editor loads, hide the simulator to make more space
        onEditorContentLoaded: e => driverRef.hideSimulator(),
        onWorkspaceSave: e => {
          console.log(e.project!.header!.id, e.project);
        },
      },
      () => iframe,
    );
    driverRef.initialize();
    driverRef.hideSimulator();
    return new MakeCodeFrame(iframe, driverRef);
  }
}
