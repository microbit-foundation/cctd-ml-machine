/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { OutputRepository } from "../../OutputRepository";
import type { OutputService } from "../../OutputService";
import type { OutputTarget } from "./OutputTarget";

export class OutputServiceImpl implements OutputService {

    constructor(private outputRepository: OutputRepository) {}

    public getOutputTarget(): OutputTarget {
        return this.outputRepository.getOutputTarget();
    }
    public setOutputTarget(outputTarget: OutputTarget): void {
        return this.outputRepository.setOutputTarget(outputTarget)
    }

}

