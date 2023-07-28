/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type InputBehaviour from './InputBehaviour';
import type OutputBehaviour from './OutputBehaviour';

class ConnectionBehaviours {
  static inputBehaviour: InputBehaviour;
  static outputBehaviour: OutputBehaviour;

  public static getInputBehaviour(): InputBehaviour {
    return this.inputBehaviour;
  }
  public static getOutputBehaviour(): OutputBehaviour {
    return this.outputBehaviour;
  }

  public static setInputBehaviour(behaviour: InputBehaviour): void {
    this.inputBehaviour = behaviour;
  }
  public static setOutputBehaviour(behaviour: OutputBehaviour): void {
    this.outputBehaviour = behaviour;
  }
}

export default ConnectionBehaviours;
