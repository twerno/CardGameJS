///<reference path="../Utils/Collections/Map.ts"/>
///<reference path="../Utils/Collections/List.ts"/>
///<reference path="../core/actions/Action.ts"/>
///<reference path="../core/EventManager.ts"/>




interface IGameObjectId {
    id   : string;
    type : string;
}


interface IGameObject extends IGameObjectId {
    parent : IBoardObject;    
}

interface IMap<T> {
    [key: string] : T
}


interface IBoardObject extends IGameObject {

    owner: Player;

    stats: IMap<IStatCounter>;

    eventListeners: IGameEventListener[];

    effects: IEffect[];
    
    counters: ICounter[]; 
}


interface ICounter extends IGameObject {
    counter_type : string;
}

interface IStatCounter extends IGameObject {
    
    name: string;
    
    baseValue: number;
    
    value: number; 
}


interface ICounter extends IGameObject {

    
}


interface IActivate_Ability extends IGameObject {

    getAction(): IAction;
}


interface IGameEventListener extends IGameObject {

    //activator
    event_type: string;

    getAction(): IAction;

    // czy wlasciwy handler dla tego eventu
    triggerFor(event: core.IEvent): boolean;
}


interface IEffect extends IGameObject {

    source : IBoardObject;

    onAddEffect():void;

    onRemoveEffect():void;

    //desc():String;
}

interface IZone extends IBoardObject {
    
    list: IBoardObject[];
}

interface ICard extends IBoardObject {

    activatedAbilities: IActivate_Ability[];
}