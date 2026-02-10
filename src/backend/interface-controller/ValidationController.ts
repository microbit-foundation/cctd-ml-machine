import type { ValidationService } from "../domain/ValidationService";
import type { AbstractStates } from "../statemanagement/AbstractStates";
import type { AbstractState } from "../statemanagement/AbstractState";

export class ValidationController {
    
    constructor(private validationService: ValidationService, private states: AbstractStates) {

    }

    public async evaluateValidationSet(): Promise<void> {
        await this.validationService.evaluateValidationSet();
    }

    public shouldAutoUpdate(): AbstractState<boolean> {
        return this.states.getValidationAutoUpdate();
    }

}