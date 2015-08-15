
interface ICardEventHandler {
    (card: HsCard): Array<Action>;
}

interface ICardLeaveZoneHandler {
    (card: HsCard, reason: HsHandLeaveEnum): Array<Action>;
}