/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
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

  /**
   * Logs a message in development environment
   */
  public static log(origin: any, message: any, ...params: any[]) {
    if (!Environment.isInDevelopment) {
      return;
    }
    if (!(window as typeof window & { hasLogged: boolean }).hasLogged) {
      welcomeLog();
    }
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
  console.log(`⚙️ Development Mode :
  Welcome to the ML-Machine development mode. 
  To disable stacktrace in logs, ds() in console.
  To Enable again stacktraces using es().
  If you experience any bugs, please report them at https://github.com/microbit-foundation/cctd-ml-machine/issues`);
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
