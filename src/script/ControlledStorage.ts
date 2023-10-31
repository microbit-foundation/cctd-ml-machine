/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
type StoredValue<T> = {
  version: number;
  value: T;
};

class ControlledStorage {
  public static get<T>(key: string): T {
    const storedValue = this.getStoredItem(key);
    const parsedValue = this.parseItem<T>(storedValue);
    return parsedValue.value;
  }

  public static set<T>(key: string, value: T): void {
    const encapsulated = this.encapsulateItem(value);
    const stringified = JSON.stringify(encapsulated);
    localStorage.setItem(key, stringified);
  }

  private static getStoredItem(key: string): string {
    const value = localStorage.getItem(key);
    if (!value) {
      throw new Error(`Could not find item ${key}. No such element!`);
    }
    return value;
  }

  private static parseItem<T>(storedValue: string): StoredValue<T> {
    const parsed = JSON.parse(storedValue) as StoredValue<T>;
    if (!parsed) {
      throw new Error(`Could not parse value '${storedValue}'`);
    }
    if (!('version' in parsed)) {
      throw new Error(
        `Could not parse value '${storedValue}'. It did not contain version number`,
      );
    }
    if (!('value' in parsed)) {
      throw new Error(`Could not parse value '${storedValue}'. It did not contain value`);
    }
    return parsed;
  }

  private static encapsulateItem<T>(value: T): StoredValue<T> {
    return {
      version: 1, // todo move this magic constant
      value,
    };
  }
}

export default ControlledStorage;
