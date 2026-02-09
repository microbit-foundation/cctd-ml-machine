import type { Filter } from "../../core/filter/Filter";

export interface FilterRepository {
    getFilters(): Filter[];
    saveFilters(filters: Filter[]): void;
}