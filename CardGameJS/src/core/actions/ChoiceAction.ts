///<reference path="Action.ts"/>
///<reference path="Task.ts"/>


enum ChooseActionState {
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

class MakeAChoiceActionResult implements ITaskResult {
    task_state: TaskState = TaskState.UNKNOWN;
	selected: Array<IChoice>;
}

interface IValidateSelectedActionResult extends ITaskResult {
	validation_state : ValiationState;
	details : Array<IValidationDetail>;
}

interface IChooseActionResult extends ITaskResult {
    selected: Array<IChoice>;
} 


class ChooseActionSub extends Action {

    getParent(): ChooseAction {
        return <ChooseAction> this.parent;
    }
}


class ChooseActionOptions {
    accept_when_choice_list_is_empty: boolean = true;

    choice_is_optional: boolean = true;
}




class GenerateChoicesAction extends ChooseActionSub {

    result: IGenerateChoicesActionResult = null;


	applyResult(result: IGenerateChoicesActionResult): void {
        
        this.result = result;
				
		this.getParent().state = ChooseActionState.POPULATED_CHOICE_LIST;
    }
	
	
}



class MakeAChoiceAction extends ChooseActionSub {

	choices: Array<IChoice> = [];
	
	validationResult : IValidateSelectedActionResult = null;


    // TaskState.success === selected at least one target
    // TaskState.cancel  === no target selected; action cancelled by user
    result: MakeAChoiceActionResult = null;
	


	applyResult(result: MakeAChoiceActionResult): void {
		
        this.result = result;
		
		this.getParent().state = ChooseActionState.SELECTED;
    }


    //getParent(): ChoiceAction {
    //    return <ChoiceAction> this.parent;
    //}
}




class ValidateSelectedChoicesAction extends ChooseActionSub {

	choices: Array<IChoice> = [];
	
	selected: Array<IChoice> = [];

    options: ChooseActionOptions;
	
 
	result : IValidateSelectedActionResult;



	applyResult(result: IValidateSelectedActionResult): void {
		
        this.result = result;

		if (this.result.validation_state === ValiationState.VALID)
			this.getParent().state = ChooseActionState.VALID;
		else
			this.getParent().state = ChooseActionState.NOT_VALID;
    }
}



class ValidateSuccessAction extends Action {

	selected: Array<IChoice> = [];
}



class ChooseAction extends Action {

	_state : ChooseActionState = ChooseActionState.NEW;
	
	generateChoicesAction: GenerateChoicesAction = null;
	
	makeAChoiceAction : MakeAChoiceAction = null;
	
	validateAction: ValidateSelectedChoicesAction = null;
	
    options: ChooseActionOptions = new ChooseActionOptions();

	result: IChooseActionResult = {
        task_state: TaskState.UNKNOWN,
        selected: []
        };
	
	

	nextSubAction(): IAction {
		if (this._state === ChooseActionState.NEW) {
			this._state === ChooseActionState.POPULATING_CHOICE_LIST;
			
			return this.generateChoicesAction;
		}
		
		
		else if (this.state === ChooseActionState.POPULATED_CHOICE_LIST) {

            // choice list not empty
            if (this.generateChoicesAction.result.choices.length != 0) {
			    this._state = ChooseActionState.CHOOSING;
			    this.makeAChoiceAction.choices = this.generateChoicesAction.result.choices;
			    this.makeAChoiceAction.validationResult = null;
			
			    return this.makeAChoiceAction;
            } else { // choice_list is empty
                this.state = ChooseActionState.FINISHED;

                
                if (this.options.choice_is_optional || this.options.accept_when_choice_list_is_empty) {
                    this.result.task_state = TaskState.SUCCESS; // dont have to choose if there are no valid targets
                    return null;
                } else { 
                    this.result.task_state = TaskState.FAILURE; // target must be choosen at all cost
                    return null;
                }
            }
		}
		
		
		else if (this.state === ChooseActionState.SELECTED) {

            // selected at least one target 
            if (this.validateAction.result.task_state === TaskState.SUCCESS) {
			    this._state === ChooseActionState.VALIDATING;

                this.validateAction.options = this.options;
			    this.validateAction.choices = this.generateChoicesAction.result.choices; 
			    this.validateAction.selected = this.makeAChoiceAction.result.selected;
			
			    return this.validateAction;
            } else if (this.validateAction.result.task_state === TaskState.CANCEL) {
                this._state === ChooseActionState.FINISHED;
                this.result.task_state = TaskState.CANCEL; // no target selected; action canceled by user
                return null;
            }
		}
		
		
		else if (this.state === ChooseActionState.NOT_VALID) {
			this._state === ChooseActionState.CHOOSING;
			this.makeAChoiceAction.choices = this.generateChoicesAction.result.choices;
			this.makeAChoiceAction.validationResult = this.validateAction.result;
			
			return this.makeAChoiceAction;
		}
		
		
		else if (this.state === ChooseActionState.VALID) {
			this._state === ChooseActionState.FINISHED;
            
            this.result.task_state = TaskState.SUCCESS;
            this.generateChoicesAction.result.choices = this.generateChoicesAction.result.choices.concat();

			return null;
		}
		else
			return null;
	}

	
	applyResult(result: ITaskResult) : void {}

	get state()       : ChooseActionState   {return this._state}
	
	get asyncWorker() : ITaskAsyncWorker    {return null}

    executionMode()   : ActionExecutionMode {return ActionExecutionMode.SUB_ACTION}

    isFinished()      : boolean             {return this.result.task_state != TaskState.UNKNOWN}
}





class MakeChoiceAtRandomAction extends MakeAChoiceAction {

    private getARandomAction : GetARandomAction = new GetARandomAction(this);

	nextSubAction(): IAction {
        if (!this.getARandomAction.isFinished())
            return this.getARandomAction;
        return null;
    }


    executionMode() : ActionExecutionMode {
        if (this.getARandomAction.isFinished())
            return ActionExecutionMode.WORKER;
        else
            return ActionExecutionMode.SUB_ACTION;
    }


    get asyncWorker() : ITaskAsyncWorker {return this.__worker}


    private __worker(self: ITask, onSuccess: IResultCallback, onError: IErrorCallback): void {
        var result: MakeAChoiceActionResult = new MakeAChoiceActionResult();
        result.task_state = TaskState.SUCCESS;

        if (this.choices.length === 0) {
            onSuccess(result);
            return;
        }

        var selectedIdx : number;

        for (var i = 0; i < this.getARandomAction.result.randomNumbers.length; i++) {
            selectedIdx = this.getARandomAction.result.randomNumbers[i] % this.choices.length;
            result.selected.push(this.choices[selectedIdx]);
        }
        onSuccess(result);
        return;
    }

}

//class ChooseAtRandomAction extends ChoiceAction {

//} 