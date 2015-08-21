///<reference path="Task.ts"/>



class ActionHelper {

	static getChain(action: IAction): Array<IAction> {
		if (action.parent === null)
    		return [action];
    	else {
    		var result : Array<IAction> = ActionHelper.getChain(action.parent);
    		result.push(action);
    		return result;
    	}
	}

}


enum ActionExecutionMode {
    WORKER,
    SUB_ACTION 
}


/*
 *  IAction
 */
interface IAction extends ITask {
	
	nextSubAction(): IAction;
	
    executionMode(): ActionExecutionMode;

    isFinished(): boolean;

	parent: IAction;

    applyResult(result: ITaskResult): void;
}





class Action implements IAction {

    private _isFinished: boolean = false;

	private _parent: IAction = null;
	
	private _worker: ITaskAsyncWorker = null;

	
	constructor (parent: IAction, worker: ITaskAsyncWorker) {
		this._parent = parent;
        this._worker = worker;
	}


    applyResult(result: ITaskResult) : void {
        this._isFinished = true;
    }
    
    nextSubAction()   : IAction             {return null}

    executionMode()   : ActionExecutionMode {return ActionExecutionMode.WORKER}

    isFinished()      : boolean             {return this._isFinished}
	
	get parent()      : IAction             {return this._parent}
	
	get asyncWorker() : ITaskAsyncWorker    {return this._worker}
	
    toString()        : string              {return this.constructor['name']}
}




/*
 *  ActionList
 */	
class ActionList extends Action {
	
	list : Array<IAction> = [];
	
	constructor (parent: IAction) {
		super(parent, null);
	}
	
	
	/**
	 *  Return actions in natural order
	 */
	nextSubAction(): IAction {
		return this.list.shift() || null;
	}
	
	
    push(action: IAction): void {
        if (action != null)
            this.list.push(action);
    }

	
    pushMany(actions: Array<IAction>): void {
        if (actions != null)
            for (var i = 0; i < actions.length; i++) {
                this.list.push(actions[i]);
            }
    }

    executionMode() : ActionExecutionMode {return ActionExecutionMode.SUB_ACTION}

    isFinished()    : boolean             {return this.list.length === 0}
}






///*
// *  ActionList
// */	
//class ActionList extends Action {
//}