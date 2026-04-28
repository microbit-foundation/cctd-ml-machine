import type { Filter, FilterType } from "../../core/filter/Filter";
import type { DataService } from "../domain/DataService";
import type { AbstractState } from "../statemanagement/AbstractState";
import type { AbstractStates } from "../statemanagement/AbstractStates";

export class FilterController {
    constructor(
        private states: AbstractStates,
        private dataService: DataService
    ) { }


    hasFilterType(ACC: FilterType): boolean {
        const filters = this.states.getFilters().get();
        return filters.some(f => f.getType() === ACC);
    }

    getFilters(): AbstractState<Filter[]> {
        return this.states.getFilters();
    }

    toggleFilter(filter: FilterType): void {
        this.dataService.toggleFilter(filter);
    }
}