///<reference path="../../../CardGameJS/dist/CardGameJS.d.ts"/>




class HsPlayer extends Player {

    hp     : Counter = new Counter(this, HsConsts.HP);
    maxHP  : Counter = new Counter(this, HsConsts.MAX_HP);
    armor  : Counter = new Counter(this, HsConsts.ARMOR); 
    //attack : Counter = new Counter(this, HsConsts.ATTACK);
    
    equippedWeapon : HsCardWeapon; 

    constructor(name: string) {
        super(name);

        this.hp.set(30);
        this.maxHP.set(30);
        this.armor.set(0);
        //this.attack.set(0);
    }
}
