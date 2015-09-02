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

    jsonMetaMap(): IJSONMetaMap {
        return {
            id: IJSONSrializationMethod.NATIVE,
            type: IJSONSrializationMethod.NATIVE,
            owner: IJSONSrializationMethod.REF,
            attributes: IJSONSrializationMethod.MAP
        };
    }

    toJSON(): string {
        return JSONHelper.toJSON(this, this.jsonMetaMap());
    }
}


class Token extends GameObject implements IToken {
    source: IEffect;
    attachedTo: IBoardObject;
    token_type: string;

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['source'] = IJSONSrializationMethod.REF;
        result['attachedTo'] = IJSONSrializationMethod.REF;
        result['token_type'] = IJSONSrializationMethod.NATIVE;

        return result;
    }
}


class StatCounter extends GameObject implements IStatCounter {

    parent: IGameObject;

    statID: string;

    baseValue: number;

    value: number;

    constructor(owner: IPlayer, parent: IGameObject, statID: string, baseValue: number) {
        super();
        this.owner = owner;
        this.parent = parent;
        this.statID = statID;
        this.baseValue = baseValue;
        this.value = baseValue;
    }

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['parent'] = IJSONSrializationMethod.REF;
        result['statID'] = IJSONSrializationMethod.NATIVE;
        result['baseValue'] = IJSONSrializationMethod.NATIVE;
        result['value'] = IJSONSrializationMethod.NATIVE;

        return result;
    }
}

class Player extends GameObject implements IPlayer {

    stats: IStringMap<IStatCounter>;

    tokens: IToken[];



    affectedBy: IEffect[];

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['stats'] = IJSONSrializationMethod.MAP_OF_REFS;
        result['tokens'] = IJSONSrializationMethod.ARRAY_OF_REFS;
        result['affectedBy'] = IJSONSrializationMethod.ARRAY_OF_REFS;

        return result;
    }
}




class BoardObject extends GameObject implements IGameObject {

    parentZone: IZone;

    //    owner: IPlayer;

    parent: IBoardObject;

    attachedTo: ICard;

    source: IEffect;



    stats: IStringMap<IStatCounter> = {};

    tokens: IToken[] = [];



    effects: IEffect[] = [];

    handlers: IStringMap<IGameEventHandler[]> = {};

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['parentZone'] = IJSONSrializationMethod.REF;
        result['parent'] = IJSONSrializationMethod.REF;
        result['attachedTo'] = IJSONSrializationMethod.REF;
        result['source'] = IJSONSrializationMethod.REF;
        result['stats'] = IJSONSrializationMethod.MAP_OF_REFS;
        result['tokens'] = IJSONSrializationMethod.ARRAY_OF_REFS;
        result['effects'] = IJSONSrializationMethod.ARRAY_OF_REFS;
        result['handlers'] = IJSONSrializationMethod.MAP_OF_ARRAYS_OF_REFS;

        return result;
    }
}


class Zone extends BoardObject implements IZone {

    list: IBoardObject[] = [];

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['list'] = IJSONSrializationMethod.ARRAY_OF_REFS;

        return result;
    }
}


class Card extends BoardObject implements ICard {

    cardID: string;

    activatedAbilities: IActivate_Ability[];

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['cardID'] = IJSONSrializationMethod.NATIVE;
        result['activatedAbilities'] = IJSONSrializationMethod.ARRAY_OF_REFS;

        return result;
    }
}


class Activate_Ability extends BoardObject implements IActivate_Ability {

    abitilityType: string; // FAST, SORCERY, ...

    costOfActivation(): Object { return null };

    getAction(): IAction { return null };

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['abitilityType'] = IJSONSrializationMethod.NATIVE;

        return result;
    }
}


class GameEventHandler extends BoardObject implements IBoardObject {

    event_type: string;

    getAction(): IAction { return null };

    validateHandler(event: core.IEvent): boolean { return true };

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['event_type'] = IJSONSrializationMethod.NATIVE;

        return result;
    }
}


class Effect extends BoardObject implements IBoardObject {

    lifetime: EFFECT_LIFETIME;

    register(): void { };

    unregister(): void { };

    jsonMetaMap(): IJSONMetaMap {
        var result: IJSONMetaMap = super.jsonMetaMap();
        result['lifetime'] = IJSONSrializationMethod.NATIVE;

        return result;
    }
}
	