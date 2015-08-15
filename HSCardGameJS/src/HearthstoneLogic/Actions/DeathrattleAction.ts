///<reference path="../../../../CardGameJS/dist/CardGameJS.d.ts"/>

class DeathrattleAction extends Action {

    target : HsCard = null;

    constructor () {
        super(true);

        this.isExecutable = function(self: DeathrattleAction): boolean {
            return self.target.onDeathrattle != null;
        }

        this.pushMany2Post(this.target.onDeathrattle(this.target));


        this.addTrigger2Post(new DeathrattleEvent(this.target.owner, this.target));
    }

}