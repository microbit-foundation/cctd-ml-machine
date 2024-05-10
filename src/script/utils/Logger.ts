/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Environment from '../Environment';
class Logger {

  constructor(private origin: any) { }

  public log(message: any, ...params: any[]) {
    Logger.log(this.origin, message, params);
  }

  /**
   * Logs a message in development environment
   */
  public static log(origin: any, message: any, ...params: any[]) {
    if (!Environment.isInDevelopment) {
      return
    }
    if (!(window as typeof window & { hasLogged: boolean }).hasLogged) {
      welcomeLog();
    }
    const outputMessage = `[${origin}] ${message} ${params}`
    !(window as typeof window & { ns: boolean }).ns && console.trace(outputMessage);
    (window as typeof window & { ns: boolean }).ns && console.log(outputMessage);
  }
}
export const welcomeLog = () => {
  if (!Environment.isInDevelopment || (window as typeof window & { hasLogged: boolean }).hasLogged) {
    return
  }
  console.log(`⚙️ Development Mode :
  Welcome to the ML-Machine development mode. 
  To disable stacktrace in logs, type ns=true or ns() in console
  If you experience any bugs, please report them at https://github.com/microbit-foundation/cctd-ml-machine/issues`)
  Object.assign(window, { hasLogged: true });
}

if (!(window as typeof window & { ns: boolean }).ns) {
  Object.assign(window, { ns: false, ds: () => (window as typeof window & { ns: boolean }).ns = true })
}



export default Logger;
