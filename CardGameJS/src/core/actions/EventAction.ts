///<reference path="../GameEvents.ts"/>


///*
// *  IEventAction
// */
//interface IEventAction extends IAction {
	
//    event : core.IEvent;
//}


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
