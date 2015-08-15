//import eventMgr = require('EventManager');

/* class Action {

    run(): void {

    }
}

class onPutActionOnStackEvent extends eventMgr.EventManager.Event {
	
	static EVENT_TYPE = 'onPutActionOnStackEvent';
	
	action : Action;
	onTopOfStack : boolean; 
	
	constructor (action: Action, onTopOfStack: boolean){
		super();
		
		this.event_type = onPutActionOnStackEvent.EVENT_TYPE;
		this.action = action;
		this.onTopOfStack = onTopOfStack;
    }
    
    static new(action: Action, onTopOfStack: boolean) : onPutActionOnStackEvent {
    	return new onPutActionOnStackEvent(action, onTopOfStack);
    }
}

class GameMgr {

    dispather: eventMgr.EventManager.EventManager = new eventMgr.EventManager.EventManager();

	// kolejka FILO
    stack: Array<Action> = [];
	currentAction : Action = null;
	
	
	executeActionsOnStack() {
//		currentAction
	}

    putActionOnTheTop(action: Action) {
        this.stack = [action].concat(this.stack);

        this.dispather.dispatch(
        	onPutActionOnStackEvent.new(action, true),
        	this.executeActionsOnStack
        	
        );
    }

    putActionOnTheBottom(action: Action) {
		this.stack.push(action);
		
        this.dispather.dispatch(
        	onPutActionOnStackEvent.new(action, false),
        	this.executeActionsOnStack
        );
    }
    
    runStack() {
    	
    }

} */