/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

class Environment {
  public static isInDevelopment: boolean = process.env.NODE_ENV === 'development';
  public static pageTitle: string = process.env.VITE_TITLE
    ? process.env.VITE_TITLE
    : 'Learning tool';
}

export default Environment;
