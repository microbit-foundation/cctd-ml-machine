/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Environment from '../Environment';
import type { Logger } from './Logger';

type DevWindow = typeof window & {
  hasLogged?: boolean;
  ns?: boolean;
  ds?: () => void;
  es?: () => void;
};

const getDevWindow = (): DevWindow | undefined =>
  typeof window !== 'undefined' ? (window as DevWindow) : undefined;

const getStorage = (): Storage | undefined => {
  const globalObject = globalThis as { localStorage?: Storage };
  return globalObject.localStorage;
};

const isStackTraceEnabled = () => {
  const storage = getStorage();
  if (storage?.getItem) {
    return storage.getItem('dev_print_stacktrace') === 'true';
  }
  return false;
};
const setStackTraceEnabled = (val: boolean) =>
  getStorage()?.setItem('dev_print_stacktrace', val.toString());

class ConsoleLogger implements Logger {
  constructor(private origin: any) { }

  public info(message: any, ...params: any[]) {
    ConsoleLogger.log(this.origin, message, params);
  }

  public warn(message: any, ...params: any[]) {
    ConsoleLogger.warn(this.origin, message, params);
  }

  /**
   * Logs a message in development environment
   */
  public static warn(origin: any, message: any, ...params: any[]) {
    if (!Environment.isInDevelopment) {
      return;
    }
    welcomeLog();
    const warnOutputMessage = `[${origin}] ${message} ${params}`;
    const traceOutputMessage = `[${origin}] %c${message} ${params}`;
    isStackTraceEnabled() && console.trace(traceOutputMessage, 'color: orange;');
    !isStackTraceEnabled() && console.warn(warnOutputMessage);
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
    isStackTraceEnabled() && console.trace(outputMessage);
    !isStackTraceEnabled() && console.log(outputMessage);
  }
}

export const welcomeLog = () => {
  const devWindow = getDevWindow();
  if (
    !Environment.isInDevelopment ||
    devWindow?.hasLogged
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
  devWindow && Object.assign(devWindow, { hasLogged: true });
};

const devWindow = getDevWindow();

if (devWindow && devWindow.ns === undefined) {
  Object.assign(devWindow, {
    ns: isStackTraceEnabled(),
    ds: () => {
      console.log('Disabled stacktraces, enable again using es()');
      setStackTraceEnabled(false);
    },
    es: () => {
      console.log('Enabled stacktraces');
      setStackTraceEnabled(true);
    },
  });
}

export default ConsoleLogger;
