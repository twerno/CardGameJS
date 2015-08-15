///<reference path="../../../../CardGameJS/dist/CardGameJS.d.ts"/>

class WeaponDestroyedEvent extends GameEvents.Event {

    static EVENT_TYPE = 'WeaponDestroyedEvent';

    owner  : HsPlayer;
    weapon : HsCardWeapon;



    /**
     *  constructor
     */
    constructor(owner: HsPlayer, weapon : HsCardWeapon) {
        super(WeaponDestroyedEvent.EVENT_TYPE);

        this.owner  = owner;
        this.weapon = weapon; 
    }



    /**
     *  destructor
     */
    dispose(): void {
        this.owner  = null;
        this.weapon = null;

        super.dispose();
    }

}