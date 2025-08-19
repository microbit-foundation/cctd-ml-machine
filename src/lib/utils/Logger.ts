/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get } from 'svelte/store';
import Environment from '../Environment';
import PersistantWritable from '../repository/PersistantWritable';

const nsStore = new PersistantWritable(false, 'dev_ns');

class Logger {
  constructor(private origin: any) {}

  public log(message: any, ...params: any[]) {
    Logger.log(this.origin, message, params);
  }

  public warn(message: any, ...params: any[]) {
    Logger.warn(this.origin, message, params);
  }

  /**
   * Logs a message in development environment
   */
  public static warn(origin: any, message: any, ...params: any[]) {
    if (!Environment.isInDevelopment) {
      return;
    }
    welcomeLog();
    const outputMessage = `[${origin}] ${message} ${params}`;
    !get(nsStore) && console.trace(outputMessage);
    get(nsStore) && console.warn(outputMessage);
  }

  /**
   * Logs a message in development environment
   */
  public static log(origin: any, message: any, ...params: any[]) {
    if (!Environment.isInDevelopment) {
      return;
    }
    welcomeLog();
    const outputMessage = `[${origin}] ${message} ${params}`;
    !get(nsStore) && console.trace(outputMessage);
    get(nsStore) && console.log(outputMessage);
  }
}

export const welcomeLog = () => {
  if (
    !Environment.isInDevelopment ||
    (window as typeof window & { hasLogged: boolean }).hasLogged
  ) {
    return;
  }
  console.log(`⚙️ Development Mode:
Welcome to the ML-Machine development environment. 
You are currently running the application in development mode, which provides enhanced debugging capabilities.

To disable stack traces in logs for a cleaner console output, use the 'ds()' command in the browser console.
To re-enable stack traces for detailed debugging, use the 'es()' command.

If you encounter any issues, unexpected behavior, or bugs, please report them to our team by opening an issue at:
https://github.com/microbit-foundation/cctd-ml-machine/issues.

Thank you for contributing to the improvement of ML-Machine!`);
  Object.assign(window, { hasLogged: true });
};

if (!(window as typeof window & { ns: boolean }).ns) {
  Object.assign(window, {
    ns: get(nsStore),
    ds: () => {
      console.log('Disabled stacktraces, enable again using es()');
      nsStore.set(true);
    },
    es: () => {
      console.log('Enabled stacktraces');
      nsStore.set(false);
    },
  });
}

export default Logger;
