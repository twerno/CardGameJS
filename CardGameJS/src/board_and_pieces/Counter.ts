///<reference path="../Utils/Collections/List.ts"/>

class Counter extends GameObjectID {

    private _parent: GameObject;
    private _value: number;
    private _baseValue: number;

    private _counterId: string;

   // doValidate: (counter: Counter, newVal: number) => boolean = null;

    doGetMax: (counter: Counter) => number = null;
    doGetMin: (counter: Counter) => number = null;

    activeEffects: Collections.List<Effect> = new Collections.List<Effect>();


    constructor(parent: GameObject, counterId: string) {
        super();

        this._parent = parent;
        this._counterId = counterId;

        this._parent.counters.put(counterId, this);
    }



    /**
     *  init
     */
    set(baseValue: number): void {
        this._baseValue = baseValue;
        this._value = baseValue;
    }



    /**
     *  set value
     */
    set value(newVal: number) {

        if (this.doGetMin != null)
            newVal = Math.max(newVal, this.doGetMin(this));
        if (this.doGetMin != null)
            newVal = Math.min(newVal, this.doGetMin(this));

        this._value = newVal;
    } 



    /**
     *  get value
     */
    get value(): number {
        return this._value;
    } 



    /**
     *  get baseValue
     */
    get baseValue(): number {
        return this._baseValue;
    }



    /**
     *  get parent
     */
    get parent(): GameObject {
        return this._parent; 
    }



    /**
     *  get counterID
     */
    get counterID(): string {
        return this._counterId;
    } 
     
}