///<reference path="../../../../CardGameJS/dist/CardGameJS.d.ts"/>

class DeathrattleEvent extends GameEvents.Event {

    static EVENT_TYPE = 'DeathrattleEvent';

    owner : HsPlayer;
    card  : HsCard;



    /**
     *  constructor
     */
    constructor(owner: HsPlayer, card : HsCard) {
        super(DeathrattleEvent.EVENT_TYPE);

        this.owner  = owner;
        this.card = card; 
    }



    /**
     *  destructor
     */
    dispose(): void {
        this.owner = null;
        this.card  = null;

        super.dispose();
    }

}