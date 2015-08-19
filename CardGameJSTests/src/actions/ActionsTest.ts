///<reference path="../../../CardGameJS/dist/CardGameJS.d.ts"/>
 
class Beer {};

var eventMgr : core.EventManager = new core.EventManager();


class BuyABeerAction extends Actions {
	
    constructor(parent: IAction) {
    	super(parent);

    	this.actionsFIFO.push(new GoToALocalShopAction(this));
        //this.pushMany([new LookForABeerAction(this, new BeerFoundEvent(new Beer()))]);
    	
    	this.actionsFIFO.push(
    		new SimpleAction(this,
    			function(self: SimpleAction, onSuccess: IResultCallback, onError: IErrorCallback): void {
            		onSuccess(null);
        	    }));
    	
    	//this.actionsFIFO.push(new GoHomeAction(this));
    }                                                                                                   
}


class GoToALocalShopAction extends Actions {

    constructor(parent: IAction) {
        super(parent);
    }
}

// empty action
class GoHomeAction extends SimpleAction {

    toString():string {
        return super.toString();
    }
}       

// dispatch an event action
//class LookForABeerAction extends DispatchEventAction {

//    constructor(parent: IAction, event: core.IEvent) {
//        super(parent, event, eventMgr);
//    }
//}


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
class TakeBeerAction extends Actions {

    beer : Beer;

    constructor(parent: IAction, beer: Beer) {
        super(parent);

        this.beer = beer;

        this.pushMany([new PayForABeerAction(this, beer)]);
    }
}

class PayForABeerAction extends Actions {
    beer : Beer;

    constructor(parent: IAction, beer: Beer) {
        super(parent);

        this.beer = beer;
    }
}

function documentWrite(html: string): void {
    var wrap = document.createElement('div');
	var frag = document.createDocumentFragment();
	wrap.innerHTML = html;
	while (wrap.firstChild) {
		document.getElementById('log').appendChild(wrap.firstChild);
	}
}


eventMgr.addEventListener(BeerFoundEvent.EVENT_TYPE, null, 
    function(context: GameObject, event: BeerFoundEvent): Array<IAction> {
        return [new TakeBeerAction(null, event.beer)];
    });

var stack : ActionStack = new ActionStack();
stack.onActionSuccess.add(
    function (stack: ActionStack, action: IAction): void {
        console.log('onActionSuccess - ' +action.toString());
        documentWrite('<div class="row">'
                        +'<div class="col-xs-2">onActionSuccess</div>'
                        +'<div class="col-xs-3">' +action +'</div>'
                        +'<div class="col-xs-4">[' +stack._stackFILO +']</div>'
                        +'</div>');
    });

stack.onBeforeAction.add(
    function (stack: ActionStack, action: IAction): void {
        console.log('onBeforeAction - ' + action.toString(), stack._stackFILO);
        //document.writeln('<div class="row">');
        //document.writeln('<div class="col-xs-2">onBeforeAction</div>');
        //document.writeln('<div class="col-xs-3">' +action +'</div>');
        //document.writeln('<div class="col-xs-4">[' +actionChain +']</div>');
        //document.writeln('</div>');
    });

stack.onError.add(
        function (stack: ActionStack, action: IAction, err: Error): void {
        console.log('onError - ' + action.toString() +'\n' +err, action.getChain(), err);
        documentWrite('<div class="row">'
                        +'<div class="col-xs-2">onError</div>'
                        +'<div class="col-xs-3">' +action +'</div>'
                        +'<div class="col-xs-4 error">' +err +'</div>'
                        +'</div>');
    });

stack.onStackComplete = 
    function(stack: ActionStack):void {
        console.log('onStackComplete');
        documentWrite('<div class="row">'
                        +'<div class="col-xs-2">onStackComplete</div>'
                        +'</div>');
    };

stack.onPutActionOnStack =
    function(stack: ActionStack, action: IAction): void {
        documentWrite('<div class="row">'
                        +'<div class="col-xs-2">onPutActionOnStack</div>'
                        +'<div class="col-xs-3">' +action +'</div>'
//        document.writeln('<div class="col-xs-4">' +'pre: ' +action.preActions +'; post: ' +action.postActions +'</div>');
//        document.writeln('<div class="col-xs-3">[' +stack.chain +']</div>');
                        +'</div>');
    }

document.writeln('<div id="log" class="container-fluid">')
stack.putOnTop(new BuyABeerAction(null));
stack.run();