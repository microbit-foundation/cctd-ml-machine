/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export class MockBluetoothCharacteristicProperties
  implements BluetoothCharacteristicProperties
{
  readonly authenticatedSignedWrites: boolean = false;
  readonly broadcast: boolean = false;
  readonly indicate: boolean = false;
  readonly notify: boolean = false;
  readonly read: boolean = false;
  readonly reliableWrite: boolean = false;
  readonly writableAuxiliaries: boolean = false;
  readonly write: boolean = false;
  readonly writeWithoutResponse: boolean = false;
}
