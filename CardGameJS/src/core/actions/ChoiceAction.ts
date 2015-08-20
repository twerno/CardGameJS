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



interface IChoicesActionResult extends ITaskResult {
	choiceList: Array<IChoice>;
}

interface IChooseActionResult extends ITaskResult {
	selected: Array<IChoice>;
}

interface IValidateActionResult extends ITaskResult {
	validation_state : ValiationState;
	details : Array<IValidationDetail>;
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




class GenerateChoiceListAction extends ChoiceSubAction {

    result: IChoicesActionResult = null;


	applyResult(result: IChoicesActionResult): void {
        this.result = result;
				
		this.getParent().state = ChoiceActionState.POPULATED_CHOICE_LIST;
    }
	
	
}



class ChooseAction extends ChoiceSubAction {

	choiceList: Array<IChoice> = [];
	
	validationResult : IValidateActionResult = null;


    // TaskState.success === selected at least one target
    // TaskState.cancel  === no target selected; action cancelled by user
    result: IChooseActionResult = null;
	


	applyResult(result: IChooseActionResult): void {
		
        this.result = result;
		
		this.getParent().state = ChoiceActionState.SELECTED;
    }
}




class ValidateAction extends ChoiceSubAction {

	choiceList: Array<IChoice> = [];
	
	selected: Array<IChoice> = [];

    options: ChoiceActionOptions;
	
 
	result : IValidateActionResult;



	applyResult(result: IValidateActionResult): void {
		
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
	
	generateChoicesAction: GenerateChoiceListAction = null;
	
	chooseAction : ChooseAction = null;
	
	validateAction: ValidateAction = null;
	
    options: ChoiceActionOptions = new ChoiceActionOptions();

	result: ITaskResult = {task_state: TaskState.UNKNOWN};
	
	

	getNextAction(): IAction {
		if (this._state === ChoiceActionState.NEW) {
			this._state === ChoiceActionState.POPULATING_CHOICE_LIST;
			
			return this.generateChoicesAction;
		}
		
		
		else if (this.state === ChoiceActionState.POPULATED_CHOICE_LIST) {

            // choice list not empty
            if (this.generateChoicesAction.result.choiceList.length != 0) {
			    this._state = ChoiceActionState.CHOOSING;
			    this.chooseAction.choiceList = this.generateChoicesAction.result.choiceList;
			    this.chooseAction.validationResult = null;
			
			    return this.chooseAction;
            } else { // choice_list is empty
                this.state = ChoiceActionState.FINISHED;

                
                if (this.options.choice_is_optional || this.options.accept_when_choice_list_is_empty) {
                    this.result.task_state = TaskState.SUCCESS; // no target is permited
                    return null;
                } else { 
                    this.result.task_state = TaskState.FAIULE; // target must be choose at all cost
                    return null;
                }
            }
		}
		
		
		else if (this.state === ChoiceActionState.SELECTED) {

            // selected at least one target 
            if (this.validateAction.result.task_state === TaskState.SUCCESS) {
			    this._state === ChoiceActionState.VALIDATING;

                this.validateAction.options = this.options;
			    this.validateAction.choiceList = this.generateChoicesAction.result.choiceList; 
			    this.validateAction.selected = this.chooseAction.result.selected;
			
			    return this.validateAction;
            } else if (this.validateAction.result.task_state === TaskState.CANCEL) {
                this._state === ChoiceActionState.FINISHED;
                this.result.task_state = TaskState.CANCEL; // no target selected; action canceled by user
                return null;
            }
		}
		
		
		else if (this.state === ChoiceActionState.NOT_VALID) {
			this._state === ChoiceActionState.CHOOSING;
			this.chooseAction.choiceList = this.generateChoicesAction.result.choiceList;
			this.chooseAction.validationResult = this.validateAction.result;
			
			return this.chooseAction;
		}
		
		
		else if (this.state === ChoiceActionState.VALID) {
			this._state === ChoiceActionState.FINISHED;
            this.result.task_state = TaskState.SUCCESS;
			return null;
		}
		else
			return null;
	}

	
	
	get state(): ChoiceActionState {return this._state}
	
    applyResult(result: ITaskResult) : void {}
	
	isExecutable()   : boolean     {return false}
	
	isComplex()      : boolean     {return true}
	
	get worker()     : ITaskWorker {return null}
	
	isEmpty()        : boolean     {return false}
}
