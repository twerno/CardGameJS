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
    function (stack: ActionStack, action: Action, actionChain: Array<Action>): void {
        console.log('onActionSuccess - ' +action.toString(), actionChain);
        document.writeln('<div class="row">');
        document.writeln('<div class="col-xs-2">onActionSuccess (#'+ stack.id+')</div>');
        document.writeln('<div class="col-xs-3">' +action +'</div>');
        document.writeln('<div class="col-xs-4">[' +actionChain +']</div>');
        document.writeln('</div>');
    });

stack.onBeforeAction.add(
    function (stack: ActionStack, action: Action, actionChain: Array<Action>): void {
        console.log('onBeforeAction - ' + action.toString(), actionChain);
        //document.writeln('<div class="row">');
        //document.writeln('<div class="col-xs-2">onBeforeAction</div>');
        //document.writeln('<div class="col-xs-3">' +action +'</div>');
        //document.writeln('<div class="col-xs-4">[' +actionChain +']</div>');
        //document.writeln('</div>');
    });

stack.onError.add(
        function (stack: ActionStack, action: Action, actionChain: Array<Action>, err: Error): void {
        console.log('onError - ' + action.toString() +'\n' +err, actionChain, err);
        document.writeln('<div class="row">');
        document.writeln('<div class="col-xs-2">onError (#'+ stack.id+')</div>');
        document.writeln('<div class="col-xs-3">' +action +'</div>');
        document.writeln('<div class="col-xs-4 error">' +err +'</div>');
        document.writeln('</div>');
    });

stack.onStackComplete = 
    function(stack: ActionStack):void {
        console.log('onStackComplete');
        document.writeln('<div class="row">');
        document.writeln('<div class="col-xs-2">onStackComplete (#'+ stack.id+') </div>');
        document.writeln('</div>');
    };

stack.onPutActionOnStack =
    function(stack: ActionStack, action: Action): void {
        document.writeln('<div class="row">');
        document.writeln('<div class="col-xs-2">onPutActionOnStack (#'+ stack.id+') </div>');
        document.writeln('<div class="col-xs-3">' +action +'</div>');
        document.writeln('<div class="col-xs-4">' +'pre: ' +action.preActions +'; post: ' +action.postActions +'</div>');
        document.writeln('<div class="col-xs-3">[' +stack.chain +']</div>');
        document.writeln('</div>');
    }

document.writeln('<div class="container-fluid">')
stack.putOnStack(new BuyABeerAction());
stack.run();