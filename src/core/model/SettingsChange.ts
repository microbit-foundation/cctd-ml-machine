import type { ModelOption } from "./ModelOption";

export class SettingsChange<T> {
  public constructor(
    private readonly option: ModelOption,
    private readonly oldValue: T,
    private readonly newValue: T
  ) {}

  public getOption(): ModelOption {
    return this.option;
  }

  public getOldValue(): T {
    return this.oldValue;
  }

  public getNewValue(): T {
    return this.newValue;
  }
}