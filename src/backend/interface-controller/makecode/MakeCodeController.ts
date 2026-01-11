/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MakeCodeProject } from '@microbit/makecode-embed';
import type { StatesMakeCodeProjectRepository } from '../../infrastructure/StatesMakeCodeProjectRepository';
import type { AbstractState } from '../../statemanagement/AbstractState';

export class MakeCodeController {
  public constructor(private projectRepository: StatesMakeCodeProjectRepository) { }

  public getMakeCodeProject(): AbstractState<MakeCodeProject> {
    const currentState = this.projectRepository.getMakeCodeProject()
    if (!currentState.get()) {
      currentState.set(defaultMakeCodeProject)
    }
    return currentState as AbstractState<MakeCodeProject>
  }

  public hasProjectBeenChanged(): boolean {
    const currentState = this.projectRepository.getMakeCodeProject();
    const current = currentState.get();
    if (!current) return false;
    console.log(current)

    const currentMainBlocks = current?.text?.['main.blocks'] ?? '';
    const defaultMainBlocks = defaultMakeCodeProject.text?.['main.blocks'] ?? '';

    // Trim to avoid simple whitespace differences triggering a change
    return currentMainBlocks.trim() !== defaultMainBlocks.trim();
  }

  public setMakeCodeProject(project: MakeCodeProject) {
    this.projectRepository.getMakeCodeProject().set(project);
  }
  
}


export const defaultMakeCodeProject: MakeCodeProject = {
        text: {
          'README.md': ``,

          'main.blocks': `
            <xml xmlns="https://developers.google.com/blockly/xml"><variables></variables><block type="pxt-on-start" x="21" y="17"><statement name="HANDLER"><block type="MLMachine_showPairingPattern"></block></statement></block></xml>
            `,

          'main.ts': ``,

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
      }



