///<reference path="../../../CardGameJS/dist/CardGameJS.d.ts"/>
 
class Beer2 {};

var eventMgr2 : core.EventManager = new core.EventManager();


class BuyABeerAction2 extends ActionList {
	
    constructor(parent: IAction) {
    	super(parent);

    	this.actionsFIFO.push(new GoToALocalShopAction2(this));
    	
    	this.actionsFIFO.push(
    		new AtomicAction(this,
    			function(self: BuyABeerAction2, actionChain: Array<IAction>): void {
            		// do something
        	    }));
    	
    	this.actionsFIFO.push(new GoHomeAction2(this));
    }                                                                                                   
}


class GoToALocalShopAction2 extends ActionList {
}

// empty action
class GoHomeAction2 extends SimpleAction {
}

// dispatch an event action
class LookForABeerAction2 extends ActionList {
    constructor(parent: IAction) {
        super(parent);

//        this.eventMgr = eventMgr;
//
//        this.addEvent2PostActions(new BeerFoundEvent2(new Beer()));
//
//        this.runAction = function(self: BuyABeerAction, actionChain: Array<Action>): void {
//            // do something
//        }
    }
}


// an event
class BeerFoundEvent2 implements core.IEvent {

    static EVENT_TYPE = 'BeerFoundEvent';

    eventType : string = BeerFoundEvent2.EVENT_TYPE;
    beer : Beer2;

    constructor(beer: Beer2) {
        this.beer = beer;
    }

}


// onBeerFoundEvent
class TakeBeerAction2 extends ActionList {

    beer : Beer2;

    constructor(parent: IAction, beer: Beer2) {
        super(parent);

        this.beer = beer;

//        this.runAction = function(self: BuyABeerAction, actionChain: Array<Action>): void {
//            // do something
//        }

//        this.pushMany2Post([new PayForABeerAction(beer)]);
    }
}

class PayForABeerAction2 extends ActionList {
    beer : Beer2;

    constructor(parent: IAction, beer: Beer2) {
        super(parent);

        this.beer = beer;

//        this.runAction = function(self: BuyABeerAction, actionChain: Array<Action>): void {
//            // do something
//        }
    }
}


//eventMgr2.addEventListener(BeerFoundEvent2.EVENT_TYPE, null, 
//    function(context: GameObject, event: BeerFoundEvent2): Array<IAction> {
//        return [new TakeBeerAction2(null, event.beer)];
//    });

var stack2 : ActionStack2 = new ActionStack2();
stack2.onActionSuccess.add(
    function (stack: ActionStack2, action: IAction, actionChain: Array<IAction>): void {
        console.log('onActionSuccess - ' +action.toString(), actionChain);
        document.writeln('<div class="row">');
        document.writeln('<div class="col-xs-2">onActionSuccess</div>');
        document.writeln('<div class="col-xs-3">' +action +'</div>');
        document.writeln('<div class="col-xs-4">[' +actionChain +']</div>');
        document.writeln('</div>');
    });

stack2.onBeforeAction.add(
    function (stack: ActionStack2, action: IAction, actionChain: Array<IAction>): void {
        console.log('onBeforeAction - ' + action.toString(), actionChain);
        //document.writeln('<div class="row">');
        //document.writeln('<div class="col-xs-2">onBeforeAction</div>');
        //document.writeln('<div class="col-xs-3">' +action +'</div>');
        //document.writeln('<div class="col-xs-4">[' +actionChain +']</div>');
        //document.writeln('</div>');
    });

stack2.onError.add(
        function (stack: ActionStack2, action: IAction, actionChain: Array<IAction>, err: Error): void {
        console.log('onError - ' + action.toString() +'\n' +err, actionChain, err);
        document.writeln('<div class="row">');
        document.writeln('<div class="col-xs-2">onError</div>');
        document.writeln('<div class="col-xs-3">' +action +'</div>');
        document.writeln('<div class="col-xs-4 error">' +err +'</div>');
        document.writeln('</div>');
    });

stack2.onStackComplete = 
    function(stack: ActionStack2):void {
        console.log('onStackComplete');
        document.writeln('<div class="row">');
        document.writeln('<div class="col-xs-2">onStackComplete</div>');
        document.writeln('</div>');
    };

stack2.onPutActionOnStack =
    function(stack: ActionStack2, action: IAction): void {
        document.writeln('<div class="row">');
        document.writeln('<div class="col-xs-2">onPutActionOnStack</div>');
        document.writeln('<div class="col-xs-3">' +action +'</div>');
//        document.writeln('<div class="col-xs-4">' +'pre: ' +action.preActions +'; post: ' +action.postActions +'</div>');
//        document.writeln('<div class="col-xs-3">[' +stack.chain +']</div>');
        document.writeln('</div>');
    }

document.writeln('<div class="container-fluid">')
stack2.putOnStack(new BuyABeerAction2(null));
stack2.run();