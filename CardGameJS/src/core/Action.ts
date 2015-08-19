///<reference path="GameEvents.ts"/>
///<reference path="Task.ts"/>





/*
 *  IAction
 */
interface IAction extends ITask {
	
	getNextAction(): IAction;
	
	isComplex(): boolean;
	
	isExecutable(): boolean;
	
	isEmpty(): boolean;

	parent: IAction;

    getChain(): Array<IAction>;
}



/*
 *  IEventAction
 */
interface IEventAction extends IAction {
	
    event : core.IEvent;
}



/*
 *  IAsyncAction
 */
interface IAsyncAction extends IAction {
	
    onSuccess: IEventAction;
    onFailure: IEventAction;
    onTimeout: IEventAction;
}



/*
 *  SimpleAction
 */	
class SimpleAction implements IAction {
	
	parent: IAction = null;
	
	worker: ITaskWorker = null;

	
	
	constructor (parent: IAction, worker: ITaskWorker = null) {
		this.parent = parent;
        this.worker = worker;
	}



    applyResult(result: Object): void {
    }
	
	
	
	getNextAction(): IAction {
		return null;
	}
	
	
	
	isComplex(): boolean {
		return false;
	}
	
	
	
	isExecutable(): boolean {
		return true;
	}
	
	
	
	isEmpty(): boolean {
		return this.worker === null;	
	}


	
    toString(): string {
        return this.constructor['name'];
    }
    
    

    getChain(): Array<IAction> {
    	if (this.parent === null)
    		return [this];
    	else {
    		var result : Array<IAction> = this.parent.getChain();
    		result.push(this);
    		return result;
    	}
    }
}




/*
 *  ComplexAction
 */	
class Actions implements IAction {
	
	parent: IAction = null;
	
	actionsFIFO : Array<IAction> = [];


	
	constructor(parent: IAction) {
		this.parent = parent;
	}
	
	
	
	/**
	 *  Return actions in natural order
	 */
	getNextAction(): IAction {
		return this.actionsFIFO.shift() || null;
	}
	
	

    applyResult(result: Object): void {
    }


	
	isComplex(): boolean {
		return true;
	}
	
	
	
	isExecutable(): boolean {
		return false;
	}
	
	
	
	isEmpty(): boolean {
		return this.actionsFIFO.length === 0;	
	}
		
	
	
	
    toString(): string {
        return this.constructor['name'];
    }



    get worker(): ITaskWorker {
        return null;
    }



    getChain(): Array<IAction> {
    	if (this.parent === null)
    		return [this];
    	else {
    		var result : Array<IAction> = this.parent.getChain();
    		result.push(this);
    		return result;
    	}
    }



    pushMany(actions: Array<IAction>): void {
        if (actions != null)
            for (var i = 0; i < actions.length; i++) {
                this.actionsFIFO.push(actions[i]);
            }
    }
}





///**
// *  DispatchEventActionWrapper
// */ 
//class DispatchEventActionWrapper extends Actions {
	
//	private initialized : boolean = false;
	
//	event    : core.IEvent;
//	eventMgr : core.EventManager;




//	constructor(parent: IAction, event: core.IEvent, eventMgr: core.EventManager) {
//		super(parent);
		
//		this.event    = event;
//		this.eventMgr = eventMgr;
//	}
	
	
	
//	getNextAction(): IAction {
//		this.initialized || this.initializeEventHandlers();
//		return super.getNextAction();
//	}


	
//	isEmpty(): boolean {
//		return this.initialized && super.isEmpty();	
//	}



//    toString(): string {
//        return super.toString() +' (' +this.event.eventType +')';
//    }



//    private initializeEventHandlers(): void {
//		var handlerObj  : core.IHandlerObj;

//    	for (var idx = 0; idx < this.eventMgr.handlers._list.length; idx++) {
//            handlerObj = this.eventMgr.handlers._list[idx];
//    		if (handlerObj.eventType === this.event.eventType) 
//                this.actionsFIFO.push(
//                	new DispatchEventAction(this.event, handlerObj)
//                );
//    	}
//    	this.initialized = true;    	 	
//    }
//}





///**
// *  DispatchEventAction
// */
//class DispatchEventAction extends Actions {

//	event      : core.IEvent;
//	handlerObj : core.IHandlerObj;




//    constructor(event: core.IEvent, handlerObj: core.IHandlerObj) {
//        super(null);

//        this.event      = event;
//        this.handlerObj = handlerObj;

//        this.pushMany(handlerObj.handler(handlerObj.handlerCtx, event));
//    }



//    toString(): string {
//        return super.toString() +' (' +this.event.eventType +')';
//    }
//}


