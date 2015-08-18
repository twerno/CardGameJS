///<reference path="../core/GameEvents.ts"/>





/*
 *  IAction
 */
interface IAction {
	
	getNextAction(): IAction;
	
	isComplex(): boolean;
	
	isExecutable(): boolean;
	
	isEmpty(): boolean;
	
	executeAction(): void;
	
	parent: IAction;

    getChain(): Array<IAction>;
}





/*
 *  SimpleAction
 */	
class SimpleAction implements IAction {
	
	parent: IAction = null;
	
	runAction: (self: IAction) => void = null;
	
	
	
	
	constructor (parent: IAction) {
		this.parent = parent;
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
		return this.runAction === null;	
	}
	
	
	
	executeAction(): void {
		this.runAction === null || this.runAction(this);	
	};
	
	
	
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





/**
 *  AtomicAction
 */
class AtomicAction extends SimpleAction {
	
	private optionalName: string = '';
	
	
	
	
	constructor (parent: IAction, 
	             runAction: (self: IAction) => void, 
		         optionalName: string = '') {
		super(parent);
		this.runAction = runAction;
		this.optionalName = optionalName;
	}
	
	
	
    toString(): string {
        return (this.optionalName === '') ? this.constructor['name'] : this.optionalName;
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
	
	
	
	isComplex(): boolean {
		return true;
	}
	
	
	
	isExecutable(): boolean {
		return false;
	}
	
	
	
	isEmpty(): boolean {
		return this.actionsFIFO.length === 0;	
	}
	
	
	
	executeAction(): void {
		throw new Error('not executable'); 
	};		
	
	
	
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



    pushMany(actions: Array<IAction>): void {
        if (actions != null)
            for (var i = 0; i < actions.length; i++) {
                this.actionsFIFO.push(actions[i]);
            }
    }
}





/**
 *  DispatchEventAction
 */ 
class DispatchEventAction extends Actions {
	
	private initialized : boolean = false;
	
	event    : core.IEvent;
	eventMgr : core.EventManager;




	constructor(parent: IAction, event: core.IEvent, eventMgr: core.EventManager) {
		super(parent);
		
		this.event    = event;
		this.eventMgr = eventMgr;
	}
	
	
	
	getNextAction(): IAction {
		this.initialized || this.initializeEventHandlers();
		return super.getNextAction();
	}


	
	isEmpty(): boolean {
		return this.initialized && super.isEmpty();	
	}



    toString(): string {
        return super.toString() +' (' +this.event.eventType +')';
    }



    private initializeEventHandlers(): void {
		var handlerObj  : core.IHandlerObj;

    	for (var idx = 0; idx < this.eventMgr.handlers._list.length; idx++) {
            handlerObj = this.eventMgr.handlers._list[idx];
    		if (handlerObj.eventType === this.event.eventType) 
                this.actionsFIFO.push(
                	new EventAction(this.event, handlerObj)
                );
    	}
    	this.initialized = true;    	 	
    }
}





/**
 *  EventAction
 */
class EventAction extends Actions {

	event      : core.IEvent;
	handlerObj : core.IHandlerObj;




    constructor(event: core.IEvent, handlerObj: core.IHandlerObj) {
        super(null);

        this.event      = event;
        this.handlerObj = handlerObj;

        this.pushMany(handlerObj.handler(handlerObj.handlerCtx, event));
    }



    toString(): string {
        return super.toString() +' (' +this.event.eventType +')';
    }
}