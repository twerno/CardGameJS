module GameEvents {

    export class Event implements IDisposable {
        eventType : string;
        interrupt  : boolean = false;



        /**
         *  constructor
         */
        constructor (eventType: string) {
            this.eventType = eventType;
        }



        /**
         *  destructor
         */
        dispose(): void {
            this.eventType = null;
        }
            
    }

    export interface IEventHandler {
        (self: GameObject, eventType: string, actionChain: Collections.List<Action>): Array<Action>;
    }

    export interface IOnSucces {
        (): void;
    }

    export interface IOnError {
        (err: Error): void;
    }

    export interface IListenerDelegate {
        (event: Event, callBack: DispatchWraper): void;
    }

    export class IListenerData {

        event_type : string;
        run        : IListenerDelegate;

        //isRemote: boolean;
    }

    export class DispatchWraper {

        private event: Event;

        private listeners: Array<IListenerData>;

        private cursorIdx: number;

        private onSuccess: IOnSucces;

        private onError: IOnError;

        constructor(event: Event, listeners: Array<IListenerData>, onSuccess: IOnSucces, onError: IOnError) {
            this.cursorIdx = -1;
            this.event     = event;
            this.listeners = listeners;
            this.onSuccess = onSuccess;
            this.onError   = onError;
        }

        callNext(): void {
            try {
                this.cursorIdx++;

                if (this.event.interrupt
                    || this.cursorIdx >= this.listeners.length) {
                    this.onSuccess();
                } else {
                    var listener: IListenerData = this.listeners[this.cursorIdx];
                    if (listener != null
                        && listener.event_type === this.event.eventType) {
                        listener.run(this.event, this);
                    }
                }
            } catch (err) {
                if (this.onError != null)
                    this.onError(err);
            }
        }
    }

    export class EventManager {

        private listeners: Array<IListenerData> = [];

        dispatch(event: Event, callBack: any): void {
            new DispatchWraper(event, this.listeners, callBack, null).callNext();
        }

        addEventListener(eventType: string, listener: IListenerDelegate): void {
            this.listeners.push(
                {
                    'event_type': eventType,
                    'run': listener
                }
                );
        } // object, cleanup funct

        removeEventListener(listener: any): void { }

    }


    /*class DispatcherTest {

        EVENT_TYPE: string = 'TEST_TYPE';

        dispather: EventManager = new EventManager();

        onFinish() {
            console.log('finished for ');
        }

        onDoJob(event: Event, callBack: DispatchWraper) {

            callBack.callNext();
        }

        constructor(n: number = 1000000) {
            for (var i = 0; i < n; i++) {
                this.dispather.addEventListener(this.EVENT_TYPE, this.onDoJob);
            }
        }

        doTest() {
            var event: Event = new Event();
            event.event_type = this.EVENT_TYPE;
            this.dispather.dispatch(event, this.onFinish);
        }
    }

    var dispatcherTest: DispatcherTest = new DispatcherTest(100000);
    dispatcherTest.doTest();*/

}