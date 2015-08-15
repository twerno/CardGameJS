///<reference path="../../../../CardGameJS/dist/CardGameJS.d.ts"/>

class WeaponEquippedEvent extends GameEvents.Event {

    static EVENT_TYPE = 'WeaponEquippedEvent';

    owner  : HsPlayer;
    weapon : HsCardWeapon;



    /**
     *  constructor
     */
    constructor(owner: HsPlayer, weapon : HsCardWeapon) {
        super(WeaponEquippedEvent.EVENT_TYPE);

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