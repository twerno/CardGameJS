///<reference path="../../../../CardGameJS/dist/CardGameJS.d.ts"/>

class HsCard extends Card {

    cost: StatCounter = new StatCounter(this.owner, this, HsConsts.COST, 0);

    //type    : HsCardType;
    //set     : HsSet;
    //hsClass : HsClass;
    //rarity  : HsRarity; 
    //isCollectible : boolean;

    //onEnterHand        : Collections.List<ICardEventHandler> = new Collections.List<ICardEventHandler>();
    //onLeaveHand        : ICardLeaveZoneHandler = null; //onPlay, onDiscard 
    //onBattlecry        : ICardEventHandler     = null; //onCast
    //onEnterBattlefield : ICardEventHandler     = null;
    //onDeathrattle      : ICardEventHandler     = null; //onLeaveBattlefield

    /*******/

    owner: HsPlayer;

    constructor (owner: HsPlayer) {
        super();
        this.owner = owner;
    }
}



class HsCardMinion extends HsCard {

    attack : Counter = new Counter(this, HsConsts.ATTACK);
    hp     : Counter = new Counter(this, HsConsts.HP);
    maxHP  : Counter = new Counter(this, HsConsts.MAX_HP);

    minionType : HsMinionType;

    doValidateTarget : ICardEventHandler = null; // czy moze atakowac, czy tount
    onAttack : ICardEventHandler = null; // trigerry onAttack




    constructor (owner: HsPlayer) {
        super(owner);

        this.type = HsCardType.MINION;
    }
}



class HsCardWeapon extends HsCard {

    attack        : Counter = new Counter(this, HsConsts.ATTACK);
    durability    : Counter = new Counter(this, HsConsts.DURABILITY);
    maxDurability : Counter = new Counter(this, HsConsts.MAX_DURABILITY);

    doValidateTarget : ICardEventHandler = null; // czy moze atakowac, czy tount
    onAttack : ICardEventHandler = null; // trigerry onAttack


    constructor (owner: HsPlayer) {
        super(owner);

        this.type = HsCardType.WEAPON;
    }
}