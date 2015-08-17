///<reference path='GameObjectID.ts' />
	
class Token extends GameObjectID {
    tokenType: string;

    constructor(tokenType: string) {
        super();
        this.tokenType = tokenType;
    }
}
