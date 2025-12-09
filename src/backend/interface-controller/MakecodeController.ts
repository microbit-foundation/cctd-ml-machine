/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MakeCodeProject } from '@microbit/makecode-embed';

export class MakecodeController {
  public getMakecodeProject(): MakeCodeProject {
    return {
      text: {
        'README.md': ``,

        'main.blocks': `
            <xml xmlns="https://developers.google.com/blockly/xml">/xml>
            `,

        'main.ts': `
            MLMachine.onGestureRecognized("idle", function () {
                MLMachine.showPairingPattern()
            })
            `,

        'pxt.json': `
            {
            "name": "MLMachineMakecode",
            "description": "",
            "dependencies": {
                "core": "*",
                "mkcd-ml-machine": "github:r59q/mkcd-ml-machine#f3892a137bab7daeb6908fb05c8374fbaf88652a"
            },
            "files": [
                "main.blocks",
                "main.ts",
                "README.md"
            ],
            "targetVersions": {
                "branch": "v6.0.28",
                "tag": "v6.0.28",
                "commits": "https://github.com/microsoft/pxt-microbit/commits/9d308fa3c282191768670a6558e4df8af2d715cf",
                "target": "6.0.28",
                "pxt": "9.0.19"
            },
            "preferredEditor": "blocksprj"
            }
            `,
      },
    };
  }
}
