///<reference path="../../../CardGameJS/dist/CardGameJS.d.ts"/>

class Beer {};

var eventMgr : core.EventManager = new core.EventManager();


class BuyABeerAction extends Action {

    constructor() {
        super();

        this.preActions.push(new GoToALocalShopAction());
        this.postActions.push(new GoHomeAction());

        this.runAction = function(self: BuyABeerAction, actionChain: Array<Action>): void {
            // do something
        }
    }                                                                                                   
}


class GoToALocalShopAction extends Action {
    constructor() {
        super();

        this.postActions.push(new LookForABeerAction());

        this.runAction = function(self: BuyABeerAction, actionChain: Array<Action>): void {
            // do something
        }
    }
}

// empty action
class GoHomeAction extends Action {
}

// dispatch an event action
class LookForABeerAction extends Action {
    constructor() {
        super();

        this.eventMgr = eventMgr;

        this.addEvent2PostActions(new BeerFoundEvent(new Beer()));

        this.runAction = function(self: BuyABeerAction, actionChain: Array<Action>): void {
            // do something
        }
    }
}


// an event
class BeerFoundEvent implements core.IEvent {

    static EVENT_TYPE = 'BeerFoundEvent';

    eventType : string = BeerFoundEvent.EVENT_TYPE;
    beer : Beer;

    constructor(beer: Beer) {
        this.beer = beer;
    }

}


// onBeerFoundEvent
class TakeBeerAction extends Action {

    beer : Beer;

    constructor(beer: Beer) {
        super();

        this.beer = beer;

        this.runAction = function(self: BuyABeerAction, actionChain: Array<Action>): void {
            // do something
        }

        this.pushMany2Post([new PayForABeerAction(beer)]);
    }
}

class PayForABeerAction extends Action {
    beer : Beer

    constructor(beer: Beer) {
        super();

        this.beer = beer;

        this.runAction = function(self: BuyABeerAction, actionChain: Array<Action>): void {
            // do something
        }
    }
}


eventMgr.addEventListener(BeerFoundEvent.EVENT_TYPE, null, 
    function(context: GameObject, event: BeerFoundEvent): Array<Action> {
        return [new TakeBeerAction(event.beer)];
    });

var stack : ActionStack = new ActionStack();
stack.onActionSuccess.add(
    function (action: Action, actionChain: Array<Action>): void {
        console.log('onActionSuccess - ' +action.toString(), actionChain);
        document.writeln('<div class="row">');
        document.writeln('<div class="col-md-4">');
        
        document.write('onActionSuccess - ' +action.toString() +"; [" +actionChain +"]<br>");
        document.writeln('</div>');
    });

stack.onBeforeAction.add(
    function (action: Action, actionChain: Array<Action>): void {
        console.log('onBeforeAction - ' + action.toString(), actionChain);
        //document.write('onBeforeAction - ' +action.toString() +"; [" +actionChain +"]<br>");
    });

stack.onError.add(
        function (err: Error, action: Action, actionChain: Array<Action>): void {
        console.log('onBeforeAction - ' + action.toString() +'\n' +err, actionChain, err);
        document.writeln('<div class="row">');
        document.write('onBeforeAction - ' + action.toString() +'\n' +err +"<br>");
        document.writeln('</div>');
    });

stack.onStackComplete = 
    function(stack:ActionStack):void {
        console.log('onStackComplete');
        document.writeln('<div class="row">');
        document.write('onStackComplete - ' + stack.chain +"<br>");
    };

stack.onPutActionOnStack =
    function(action: Action): void {
        //document.write('<b>[' +action +']</b> ' + 'pre: ' +action.preActions +'; post: ' +action.postActions +"<br>");
    }

stack.putOnStack(new BuyABeerAction());
stack.run();