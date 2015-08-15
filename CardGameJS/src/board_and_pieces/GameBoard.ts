///<reference path="../Utils/CommTypy.ts"/>
///<reference path="../Utils/Collections/Map.ts"/>
///<reference path="../Utils/Collections/List.ts"/>

//GameObject
//Board
//Zone
//Card
//Token
//Counter
//Player


// gameboard for each player
class GameBoard extends GameObjectID {

    owner: Player;

    zones: Collections.Map<Zone> = new Collections.Map<Zone>();



    //players: Collections.Map<Player> = new Collections.Map<Player>();
}