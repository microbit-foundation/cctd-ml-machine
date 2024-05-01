/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { LiveDataVector } from "../domain/stores/LiveDataVector";

class PureVector implements LiveDataVector {
    public constructor(private numbers: number[]) { }

    public getVector(): number[] {
        return this.numbers;
    }
}

export default PureVector;