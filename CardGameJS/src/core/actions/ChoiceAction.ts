///<reference path="Action.ts"/>
///<reference path="Task.ts"/>


enum ChoiceActionState {
	NEW,
	POPULATING_CHOICE_LIST,
	POPULATED_CHOICE_LIST,
	CHOOSING,
	SELECTED,
	VALIDATING,
	VALID,
	NOT_VALID,
    FINISHED
}

enum ValiationState {
	VALID, 
    NOT_VALID
}



interface IChoice {
	choice_id: string;
}

interface IValidationDetail {
	choice: IChoice;
	validation_state : ValiationState;
}



interface IGenerateChoicesActionResult extends ITaskResult {
	choices: Array<IChoice>;
}

interface IMakeAChoiceActionResult extends ITaskResult {
	selected: Array<IChoice>;
}

interface IValidateSelectedChoicesActionResult extends ITaskResult {
	validation_state : ValiationState;
	details : Array<IValidationDetail>;
}

interface IChooseActionResult extends ITaskResult {
    selected: Array<IChoice>;
} 


class ChoiceSubAction extends Action {

    getParent(): ChoiceAction {
        return <ChoiceAction> this.parent;
    }
}


class ChoiceActionOptions {
    accept_when_choice_list_is_empty: boolean = true;

    choice_is_optional: boolean = true;
}




class GenerateChoicesAction extends ChoiceSubAction {

    result: IGenerateChoicesActionResult = null;


	applyResult(result: IGenerateChoicesActionResult): void {
        this.result = result;
				
		this.getParent().state = ChoiceActionState.POPULATED_CHOICE_LIST;
    }
	
	
}



class MakeAChoiceAction extends ChoiceSubAction {

	choices: Array<IChoice> = [];
	
	validationResult : IValidateSelectedChoicesActionResult = null;


    // TaskState.success === selected at least one target
    // TaskState.cancel  === no target selected; action cancelled by user
    result: IMakeAChoiceActionResult = null;
	


	applyResult(result: IMakeAChoiceActionResult): void {
		
        this.result = result;
		
		this.getParent().state = ChoiceActionState.SELECTED;
    }
}




class ValidateSelectedChoicesAction extends ChoiceSubAction {

	choices: Array<IChoice> = [];
	
	selected: Array<IChoice> = [];

    options: ChoiceActionOptions;
	
 
	result : IValidateSelectedChoicesActionResult;



	applyResult(result: IValidateSelectedChoicesActionResult): void {
		
		if (this.result.validation_state === ValiationState.VALID)
			this.getParent().state = ChoiceActionState.VALID;
		else
			this.getParent().state = ChoiceActionState.NOT_VALID;
    }
}



class ValidateSuccessAction extends Action {

	selected: Array<IChoice> = [];
}



class ChoiceAction extends Action {

	_state : ChoiceActionState = ChoiceActionState.NEW;
	
	generateChoicesAction: GenerateChoicesAction = null;
	
	makeAChoiceAction : MakeAChoiceAction = null;
	
	validateAction: ValidateSelectedChoicesAction = null;
	
    options: ChoiceActionOptions = new ChoiceActionOptions();

	result: IChooseActionResult = {
        task_state: TaskState.UNKNOWN,
        selected: []
        };
	
	

	nextSubAction(): IAction {
		if (this._state === ChoiceActionState.NEW) {
			this._state === ChoiceActionState.POPULATING_CHOICE_LIST;
			
			return this.generateChoicesAction;
		}
		
		
		else if (this.state === ChoiceActionState.POPULATED_CHOICE_LIST) {

            // choice list not empty
            if (this.generateChoicesAction.result.choices.length != 0) {
			    this._state = ChoiceActionState.CHOOSING;
			    this.makeAChoiceAction.choices = this.generateChoicesAction.result.choices;
			    this.makeAChoiceAction.validationResult = null;
			
			    return this.makeAChoiceAction;
            } else { // choice_list is empty
                this.state = ChoiceActionState.FINISHED;

                
                if (this.options.choice_is_optional || this.options.accept_when_choice_list_is_empty) {
                    this.result.task_state = TaskState.SUCCESS; // dont have to choose if there are no valid targets
                    return null;
                } else { 
                    this.result.task_state = TaskState.FAILURE; // target must be choosen at all cost
                    return null;
                }
            }
		}
		
		
		else if (this.state === ChoiceActionState.SELECTED) {

            // selected at least one target 
            if (this.validateAction.result.task_state === TaskState.SUCCESS) {
			    this._state === ChoiceActionState.VALIDATING;

                this.validateAction.options = this.options;
			    this.validateAction.choices = this.generateChoicesAction.result.choices; 
			    this.validateAction.selected = this.makeAChoiceAction.result.selected;
			
			    return this.validateAction;
            } else if (this.validateAction.result.task_state === TaskState.CANCEL) {
                this._state === ChoiceActionState.FINISHED;
                this.result.task_state = TaskState.CANCEL; // no target selected; action canceled by user
                return null;
            }
		}
		
		
		else if (this.state === ChoiceActionState.NOT_VALID) {
			this._state === ChoiceActionState.CHOOSING;
			this.makeAChoiceAction.choices = this.generateChoicesAction.result.choices;
			this.makeAChoiceAction.validationResult = this.validateAction.result;
			
			return this.makeAChoiceAction;
		}
		
		
		else if (this.state === ChoiceActionState.VALID) {
			this._state === ChoiceActionState.FINISHED;
            
            this.result.task_state = TaskState.SUCCESS;
            this.generateChoicesAction.result.choices = this.generateChoicesAction.result.choices.concat();

			return null;
		}
		else
			return null;
	}

	
	applyResult(result: ITaskResult) : void {}

	get state()     : ChoiceActionState   {return this._state}
	
	get worker()    : ITaskWorker         {return null}

    executionMode() : ActionExecutionMode {return ActionExecutionMode.SUB_ACTION}

    isFinished()    : boolean             {return this.result.task_state != TaskState.UNKNOWN}
	
}




class MakeChoiceAtRandomAction extends MakeAChoiceAction {

}


class ChooseAtRandomAction extends ChoiceAction {

} 