module core {

    export interface IEvent {
        eventType: string;
    }



    export interface IListener {
        (event: IEvent): void
    }



    export interface IListenerObj {
        eventType   : string;
        listener    : IListener;
        listenerCtx : Object;
    }



    export class EventManager {

        _listeners : Collections.List<IListenerObj> = new Collections.List<IListenerObj>();

        addEventListener(eventType: string, listenerCtx: Object, listener: IListener): void {
            this._listeners.add(
                {'eventType'   : eventType, 
                 'listener'    : listener,
                 'listenerCtx' : listenerCtx}
            );
        }

        removeEventListener(listenerCtx: Object, listener: IListener): void {
            var listenerObj : IListenerObj; 

            for (var i: number = this._listeners.length() -1; i >= 0; i--) {
                listenerObj = this._listeners[i];
                if (listenerObj.listener === listener 
                    && listenerObj.listenerCtx === listenerCtx) 
                    this._listeners.delete(i);
            }
        }
    }
}