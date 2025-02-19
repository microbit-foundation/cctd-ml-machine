/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { IVector } from "./IVector";

class Vector implements IVector {
    public constructor(private values: number[]) {

    }
    public getValues(): number[] {
        return this.values;
    }
    public getSize(): number {
        return this.values.length;
    }

}

export default Vector;