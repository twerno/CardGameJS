/**
 *  Tirion_Fordring
 */
class Tirion_Fordring extends HsCardMinion {

    constructor(owner: HsPlayer) {
        super(owner);

        this.name          = 'Tirion Fordring';
        this.cardID        = 'Tirion Fordring';
        this.minionType    = HsMinionType.NONE;
        this.set           = HsSet.EXPERT;
        this.hsClass       = HsClass.PALADIN;
        this.rarity        = HsRarity.LEGENDARY;
        this.isCollectible = true;

        this.attack.set(6);
        this.hp.set(6);
        this.maxHP.set(6);
        this.cost.set(8);

        this.tokens.add(new HsTountToken());
        this.tokens.add(new HsDivineShieldToken());

        this.onDeathrattle = function(self: HsCard): Array<Action> {
            return [new EquipWeaponAction(self.owner, new Ashbringer(self.owner))];
        }
    }
}



/**
 *  Ashbringer
 */
class Ashbringer extends HsCardWeapon {

    constructor(owner: HsPlayer) {
        super(owner);

        this.name          = 'Ashbringer';
        this.cardID        = 'Ashbringer';
        this.set           = HsSet.EXPERT;
        this.hsClass       = HsClass.PALADIN;
        this.rarity        = HsRarity.LEGENDARY;
        this.isCollectible = false;

        this.attack.set(5);
        this.durability.set(3);
        this.maxDurability.set(3);
        this.cost.set(5);
    }
}

  

/**
 *  Bolvar_Fordragon
 */
class Bolvar_Fordragon extends HsCardMinion {

    static BONUS_ATTACK = 'Bolvar_Fordragon_BONUS_ATTACK';

    bonusAttack : Counter = new Counter(this, Bolvar_Fordragon.BONUS_ATTACK);

    constructor(owner: HsPlayer) {
        super(owner);

        this.name          = 'Bolvar Fordragon';
        this.cardID        = 'Bolvar Fordragon';
        this.minionType    = HsMinionType.NONE;
        this.set           = HsSet.GOBLINS_VS_GNOMES;
        this.hsClass       = HsClass.PALADIN;
        this.rarity        = HsRarity.LEGENDARY;
        this.isCollectible = true;

        this.attack.set(1);
        this.hp.set(7);
        this.maxHP.set(7);
        this.cost.set(5);
        this.bonusAttack.set(0);

        //this.onEnterHand(new RegisterEventListener(null, this, '', this.computeNewVal));

        //this.tokens.add(new HsTountToken());
        //this.tokens.add(new HsDivineShieldToken());

        //this.onDeathrattle = function(self: HsCard): Array<Action> {
        //    return [new EquipWeaponAction(self.owner, new Ashbringer(self.owner))];
        }

        
    

    private computeNewVal = function(self: SetCounterValueAction, actionChain: Collections.List<Action>): number {
        return self.counter.value = self.counter.value +1;
    }


}