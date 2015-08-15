///<reference path="../../../../CardGameJS/dist/CardGameJS.d.ts"/>

class EquipWeaponAction extends Action {
    
    player : HsPlayer;
    weapon : HsCardWeapon; 

    constructor(player: HsPlayer, weapon: HsCardWeapon) {
        super();

        this.player = player;
        this.weapon = weapon;


        this.preActions.push(new DestroyWeaponAction(player, player.equippedWeapon));

        this.runAction = function(self: EquipWeaponAction, actionChain: Array<Action>): void {
            self.player.equippedWeapon = self.weapon;
        }

        this.addTrigger2Post(new WeaponEquippedEvent(player, weapon));
    }
}