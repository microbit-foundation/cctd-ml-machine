import type { ModelType } from './ModelType';

export class ModelInfo {
  constructor(
    private type: ModelType,
    private title: string,
    private label: string,
  ) {}

  public getType(): ModelType {
    return this.type;
  }

  public getTitle(): string {
    return this.title;
  }

  public getLabel(): string {
    return this.label;
  }
}
