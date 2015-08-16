///<reference path="../Utils/Collections/List.ts"/>
///<reference path="../core/GameEvents.ts"/>

class Action implements IDisposable {
    
    preActions  : Array<Action> = [];
    postActions : Array<Action> = [];

    runAction    : (self: Action, actionChain: Array<Action>) => void    = null;
    isExecutable : (self: Action, actionChain: Array<Action>) => boolean = null;
    isLegal      : (self: Action, actionChain: Array<Action>) => boolean = null;

    eventMgr : core.EventManager;


    toString(): string {
        return this.constructor['name'];
    }


    /**
     *  destructor
     */ 
    dispose() {

        if (this.preActions != null) {
            this.preActions.forEach(
                function(action: Action) {
                    action.dispose();
                });
            this.preActions = [];
            this.preActions = null;
        }

        if (this.postActions != null) {
            this.postActions.forEach(
                function(action: Action) {
                    action.dispose();
                });
            this.postActions = [];
            this.postActions = null;
        }

        this.runAction    = null;
        this.isExecutable = null;
        this.isLegal      = null;
    }




    /**
     *  pushMany2Post
     */ 
    pushMany2Post(actions:Array<Action>): void {
        var action = null;
        if (actions != null)            
            while ((action = actions.pop()) != null) {
                this.postActions.push(action);
            }
    }




    /**
     *  pushMany2Pre
     */ 
    pushMany2Pre(actions:Array<Action>): void {
        var action = null;
        if (actions != null)            
            while ((action = actions.pop()) != null) {
                this.preActions.push(action);
            }
    }

     

    /**
     *  addEvent2PreActions
     */ 
    addEvent2PreActions(event: core.IEvent) : void {
        this.pushMany2Pre(ActionHelper.getDispatchActions(event, this.eventMgr));    
    }



    /**
     *  addEvent2PostActions
     */ 
    addEvent2PostActions(event: core.IEvent) : void {
        this.pushMany2Post(ActionHelper.getDispatchActions(event, this.eventMgr));    
    }



    /**
     *  isEmpty
     */ 
    isEmpty() : boolean {
        return this.actionCount() === 0;
    }



    /**
     *  isComplex
     */ 
    isComplex() : boolean {
        return this.actionCount() > 1;
    }



    actionCount(): number {
        return (this.preActions === null ? 0 : this.preActions.length) 
               + (this.postActions === null ? 0 : this.postActions.length)
               + (this.runAction === null ? 0 : 1);
    }

}
    



/*
 *  DispatchEventAction
 */ 
class DispatchEventAction extends Action {
	
	event      : core.IEvent;
	handlerObj : core.IHandlerObj;



	constructor(event: core.IEvent, handlerObj: core.IHandlerObj) {
		super();
		
		this.event      = event;
		this.handlerObj = handlerObj;


        this.pushMany2Post(handlerObj.handler(handlerObj.handlerCtx, event));	
	}



    toString(): string {
        return super.toString() +' (' +this.event.eventType +')';
    }
}



/**
 *  RegisterEventListener
 */
class RegisterEventListener extends Action {

    globalEventBus : any;
    eventType      : string;
    card           : Card;
    handler        : GameEvents.IEventHandler;



    /**
     *  constructor
     */ 
    constructor(globalEventBus: any, card: Card, eventType: string, handler: GameEvents.IEventHandler) {
        super();

        this.globalEventBus = globalEventBus;
        this.eventType      = eventType;
        this.card           = card;
        this.handler        = handler;


        this.preActions  = null;
        this.postActions = null;

        this.runAction = function(self: RegisterEventListener, actionChain: Array<Action>): void {
            //globalEventBus.registerListener(eventType: string, object: Card, handler: 
        }
    }



    /**
     *  destructor
     */ 
    dispose() {
        this.globalEventBus = null;
        this.eventType      = null;
        this.card           = null;
        this.handler        = null;

        super.dispose();
    }

} 



/**
 *  SetCounterValueAction
 */
class SetCounterValueAction extends Action {

    counter       : Counter;
    computeNewVal : (self: SetCounterValueAction, actionChain: Array<Action>) => number = null;



    /**
     *  constructor
     */ 
    constructor(counter: Counter, computeFn: (self: SetCounterValueAction, actionChain: Array<Action>) => number) {
        super();

        this.counter       = counter;
        this.computeNewVal = computeFn;

        this.preActions  = null;
        this.postActions = null;

        this.isExecutable = function(self: SetCounterValueAction, actionChain: Array<Action>): boolean {
            return self.computeNewVal != null && self.counter != null;
        }

        this.runAction = function(self: SetCounterValueAction, actionChain: Array<Action>): void {
            counter.value = self.computeNewVal(self, actionChain);    
        }
    }



    /**
     *  destructor
     */ 
    dispose() {
        this.counter       = null;
        this.computeNewVal = null;

        super.dispose();
    }
}
