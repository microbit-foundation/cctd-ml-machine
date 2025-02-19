/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { IVector } from "./IVector";

export class Vector implements IVector {
    
    getValues(): number[] {
        throw new Error("Method not implemented.");
    }
    getSize(): number {
        throw new Error("Method not implemented.");
    }
}

