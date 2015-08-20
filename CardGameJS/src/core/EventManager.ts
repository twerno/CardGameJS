///<reference path="actions/Action.ts"/>	

module core {

    export interface IEvent {
        eventType: string;
    }



	export interface IEventHandler {
        (context: GameObject, event: IEvent): Array<IAction>;
    }



    export interface IHandlerObj {
    	eventType  : string;
    	handler    : IEventHandler;
    	handlerCtx : GameObject;
    }



    export class EventManager {

        handlers : Collections.List<IHandlerObj> = new Collections.List<IHandlerObj>();

        addEventListener(eventType: string, handlerCtx: GameObject, handler: IEventHandler): void {
            this.handlers.add(
                {'eventType'  : eventType, 
                 'handler'    : handler,
                 'handlerCtx' : handlerCtx}
            );
        }

        removeEventListener(handlerCtx: Object, handler: IEventHandler): void {
            var listenerObj : IHandlerObj; 

            for (var i: number = this.handlers.length() -1; i >= 0; i--) {
                listenerObj = this.handlers[i];
                if (listenerObj.handler === handler 
                    && listenerObj.handlerCtx === handlerCtx) 
                    this.handlers.delete(i);
            }
        }
    }
}