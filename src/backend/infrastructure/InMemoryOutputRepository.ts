/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { OutputRepository } from '../domain/OutputRepository';
import { OutputTarget } from '../domain/implementation/output/OutputTarget';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { Logger } from '../../core/logging/Logger';

export class InMemoryOutputRepository implements OutputRepository {
  private log: Logger;
  private outputTarget: OutputTarget;

  constructor(initialOutputTarget: OutputTarget) {
    this.log = new ConsoleLogger('InMemoryOutputRepository');
    this.outputTarget = initialOutputTarget;
  }

  public getOutputTarget(): OutputTarget {
    this.log.log('getOutputTarget', this.outputTarget);
    return this.outputTarget;
  }

  public setOutputTarget(outputTarget: OutputTarget): void {
    this.log.log('setOutputTarget', outputTarget);
    this.outputTarget = outputTarget;
  }
}
