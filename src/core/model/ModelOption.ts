/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export class ModelOption {
  public constructor(private readonly name: string) {}

  getName(): string {
    return this.name;
  }
}
