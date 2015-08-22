///<reference path="../board/GameObjects.ts"/>

interface IGameObjectMap {
    [key: string]: IGameObject;
}

class GameObjectMgr {

    private numerator: number = 0;
    private gameObjects: IGameObjectMap = {};

    registerObject(gameObject: IGameObject): void {
        gameObject.id = (this.numerator++).toString();
        this.gameObjects[gameObject.id] = gameObject;
    }

    getObject(id: string): IGameObject {
        return this.gameObjects[id] || null; 
    }
}

