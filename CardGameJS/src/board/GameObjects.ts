/////<reference path="../core/actions/Action.ts"/>
/////<reference path="../core/EventManager.ts"/>
/////<reference path="../core/IGameObjects.ts"/>


class Attribute implements IAttribute {
    key: string;
    value: string;
    parent: IGameObject;

    constructor(key, value: string, parent: IGameObject) {
        this.key = key;
        this.value = value;
        this.parent = parent;
        parent.attributes[key] = this;
    }
}

class GameObject implements IGameObject {
    id: string = '';
    type: string = '';
    owner: IPlayer = null;
    attributes: IStringMap<IAttribute> = {};
}


class GameBoard implements IGameBoard {
    version: number;

    zones: IStringGameObjectMap<IZone> = {};
}

class Token implements IToken {
    owner: IPlayer;
    source: IEffect;
    attachedTo: IBoardObject;
    token_type: string;
}


class StatCounter implements IStatCounter {

    owner: IPlayer;
    parent: IGameObject;

    statID: string;

    baseValue: number;

    value: number;

    constructor(owner: IPlayer, parent: IGameObject, statID: string, baseValue: number) {
        this.owner = owner;
        this.parent = parent;
        this.statID = statID;
        this.baseValue = baseValue;
        this.value = baseValue;
    }
}

class Player extends GameObject implements IPlayer {

    owner: IPlayer;

    stats: IStringMap<IStatCounter>;

    tokens: IToken[];

    

    affectedBy: IEffect[];
}


class BoardObject extends GameObject implements IGameObject {

    parentZone: IZone;

    owner: IPlayer;

    parent: IBoardObject;

    attachedTo: ICard;

    source: IEffect;



    stats: IStringMap<IStatCounter> = {};

    tokens: IToken[] = [];



    effects: IEffect[] = [];

    handlers: IStringMap<IGameEventHandler[]> = {};
}


class Zone extends BoardObject implements IZone {

    list: IBoardObject[] = [];
}


class Card extends BoardObject implements ICard {

    cardID: string;

    activatedAbilities: IActivate_Ability[];
}


class Activate_Ability extends BoardObject implements IActivate_Ability {

    abitilityType: string; // FAST, SORCERY, ...

    costOfActivation(): Object { return null };

    getAction(): IAction { return null };
}


class GameEventHandler extends BoardObject implements IBoardObject {

    event_type: string;

    getAction(): IAction { return null };

    validateHandler(event: core.IEvent): boolean { return true };
}


class Effect extends BoardObject implements IBoardObject {

    lifetime: EFFECT_LIFETIME;

    onRegister(): void { };

    onUnregister(): void { };
}
	