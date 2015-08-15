///<reference path="../../../../CardGameJS/dist/CardGameJS.d.ts"/>

class DestroyWeaponAction extends Action {

    owner  : HsPlayer;
    weapon : HsCardWeapon;
    
    constructor (owner: HsPlayer, weapon: HsCardWeapon) {
        super();

        this.owner  = owner;
        this.weapon = weapon;

        this.isExecutable = function(self: DestroyWeaponAction, actionChain: any): boolean {
            return self.owner.equippedWeapon != null;
        }

        this.runAction = function(self: DestroyWeaponAction, actionChain: any): void {
            self.owner.equippedWeapon = null;
        }

        this.addTrigger2Post(new WeaponDestroyedEvent(owner, weapon));
    }

}