///<reference path="../Utils/Collections/List.ts"/>
///<reference path="../core/GameEvents.ts"/>
///<reference path="Action.ts"/>	


interface IStackErrorCallback { (stack: ActionStack, action: IAction, error: Error): void; }
	
interface IStackActionCallback { (stack: ActionStack, action: IAction): void; }
	
interface IStackCallback { (stack: ActionStack): void; }



/*
 *  ActionStack
 */
class ActionStack {
	
    onError : Collections.List<IStackErrorCallback> = new Collections.List<IStackErrorCallback>();

    onActionSuccess : Collections.List<IStackActionCallback> = new Collections.List<IStackActionCallback>();

    onStackComplete : IStackCallback = null;

    onBeforeAction : Collections.List<IStackActionCallback> = new Collections.List<IStackActionCallback>();

    onPutActionOnStack : IStackActionCallback = null;
    

	private isCompleted: boolean = false;
	_stackFIFO : Array<IAction> = [];



    /*
     *  putOnStack
     */  
    putOnStack(action :IAction): void {
        this.isCompleted = false;
        this._stackFIFO.push(action);
        this.onPutActionOnStack === null || this.onPutActionOnStack(this, action);
    }



    run(): void {
    	if (this._stackFIFO.length != 0) {
    		var action: IAction = this._stackFIFO[0];
			
            action.isEmpty() && this.runAction(action); // log & remove 
			action.isComplex() && this.runComplexAction(action);
			!action.isComplex() && this.runAction(action);

    	} else { 
    		this.onStackComplete != null && !this.isCompleted && this.onStackComplete(this);
            this.isCompleted = true;
        }
    }



    private runComplexAction(action: IAction): void {
        var action: IAction = action.getNextAction();
        if (action != null) {
            this._stackFIFO.unshift(action);
            this.onPutActionOnStack === null || this.onPutActionOnStack(this, action);
        }
		this.run();	    	
    }



    private runAction(action: IAction): void {
    	this._stackFIFO.shift();
    	try {
    		
            if (this.onBeforeAction != null)
                for (var i = 0; i < this.onBeforeAction.length(); i++)
                    this.onBeforeAction.get(i)(this, action);

            action.isExecutable() && action.executeAction();
    		
	        if (this.onActionSuccess != null)
	            for (var i = 0; i < this.onActionSuccess.length(); i++)
	                this.onActionSuccess.get(i)(this, action);

        } catch (err) {
            if (this.onError != null)
                for (var i = 0; i < this.onError.length(); i++)
                    this.onError.get(i)(this, action, err);
        }	    		
		this.run();
    }
}