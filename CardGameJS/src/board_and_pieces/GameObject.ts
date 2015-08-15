///<reference path="../Utils/Collections/Map.ts"/>
///<reference path="../Utils/Collections/List.ts"/>
///<reference path='GameObjectID.ts' />

class GameObject extends GameObjectID {

    tokens: Collections.List<Token> = new Collections.List<Token>();

    counters: Collections.Map<Counter> = new Collections.Map<Counter>();

    ////effects:

    constructor() {
        super();
    }
}