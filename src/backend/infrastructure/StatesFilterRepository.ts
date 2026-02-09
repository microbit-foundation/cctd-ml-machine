import type { Filter } from "../../core/filter/Filter";
import type { FilterRepository } from "../domain/FilterRepository";
import type { AbstractStates } from "../statemanagement/AbstractStates";

export class StatesFilterRepository implements FilterRepository {
    public constructor(private states: AbstractStates) {} 

    saveFilters(filters: Filter[]): void {
        this.states.getFilters().set(filters);
    }
    
    getFilters(): Filter[] {
        return this.states.getFilters().get();
    }
}