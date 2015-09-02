///<reference path="../core/actions/Action.ts"/>
///<reference path="../core/EventManager.ts"/>
///<reference path="../core/JSONHelper.ts"/>

interface IStringMap<T> {
    [key: string]: T
}

interface IStringGameObjectMap<T extends IGameObject> {
    [key: string]: T
}

interface IAttribute {
    key: string;
    value: string;
    parent: IGameObject;
}

interface IGameObject extends IIdObject, IJSONSerializable {
    type: string;
    owner: IPlayer;

    attributes: IStringMap<IAttribute>;
}

enum EFFECT_LIFETIME {
    PERMANENT, UNTIL_END_OF_TURN, CUSTOM
}


interface IGameBoard {
    zones: IStringGameObjectMap<IZone>;
}


interface IToken extends IGameObject {

    source: IEffect;
    attachedTo: IBoardObject;
    token_type: string;
}


interface IStatCounter extends IGameObject {

    parent: IGameObject;

    statID: string;

    baseValue: number;

    value: number;
}

interface IPlayer extends IGameObject {

    stats: IStringMap<IStatCounter>;

    tokens: IToken[];

    affectedBy: IEffect[];
}


interface IBoardObject extends IGameObject {

    parentZone: IZone;

    parent: IBoardObject;

    attachedTo: ICard;

    source: IEffect;



    stats: IStringMap<IStatCounter>;

    tokens: IToken[];



    effects: IEffect[];

    handlers: IStringMap<IGameEventHandler[]>;
}


interface IZone extends IBoardObject {

    list: IBoardObject[];
}


interface ICard extends IBoardObject {

    cardID: string;

    activatedAbilities: IActivate_Ability[];
}


interface IActivate_Ability extends IGameObject {

    abitilityType: string; // FAST, SORCERY, ...

    costOfActivation(): Object;

    getAction(): IAction;
}


interface IGameEventHandler extends IBoardObject {

    event_type: string;

    getAction(): IAction;

    validateHandler(event: core.IEvent): boolean;
}

interface IEffect extends IBoardObject {

    lifetime: EFFECT_LIFETIME;

    register(): void;

    unregister(): void;
}
	