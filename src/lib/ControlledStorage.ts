/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
type StoredValue<T> = {
  version: number;
  value: T;
};

class ControlledStorage {
  /**
   * What storage version should be used? If old user data is expected to be broken, increasing this number will delete all the data the user has in their storage location
   */
  public static readonly localStorageVersion = 3;

  public static get<T>(key: string): T {
    const storedValue = this.getStoredItem(key);
    try {
      const parsedValue = this.parseItem<T>(storedValue);
      return parsedValue.value;
    } catch (error) {
      console.log(
        `An error occurred while parsing the stored value with key ${key}. The stored value will be deleted`,
        error,
      );
      localStorage.removeItem(key);
    }
    throw new Error(`Could not parse value '${storedValue}'`);
  }

  public static set<T>(key: string, value: T): void {
    const encapsulated = this.encapsulateItem(value);
    const stringified = JSON.stringify(encapsulated);
    localStorage.setItem(key, stringified);
  }

  public static hasValid(key: string): boolean {
    try {
      this.parseItem(this.getStoredItem(key));
    } catch (error) {
      console.log(
        `An error occurred while parsing the stored value with key ${key}. The stored value will be deleted`,
        error,
      );
      localStorage.removeItem(key);
      return false;
    }
    return !!localStorage.getItem(key);
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
    if (parsed.version !== ControlledStorage.localStorageVersion) {
      throw new Error(
        `Could not parse value '${storedValue}'. Version mismatch. Expected version ${ControlledStorage.localStorageVersion}, found version ${parsed.version}`,
      );
    }
    return parsed;
  }

  private static encapsulateItem<T>(value: T): StoredValue<T> {
    return {
      version: ControlledStorage.localStorageVersion,
      value,
    };
  }
}

export default ControlledStorage;
