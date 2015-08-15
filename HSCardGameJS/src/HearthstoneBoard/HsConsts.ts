class HsConsts {
    static COST           = 'COST';
    static HP             = 'HP';
    static MAX_HP         = 'MAX_HP';
    static ARMOR          = 'ARMOR';
    static ATTACK         = 'ATTACK';
    static DURABILITY     = 'DURABILITY';
    static MAX_DURABILITY = 'MAX_DURABILITY';
}


enum HsClass {
    DRUID,
    HUNTER,
    MAGE,
    PALADIN,
    PRIEST,
    ROUGE,
    SHAMAN,
    WARLOCK,
    WARRIOR
}

enum HsCardType {
    MINION,
    SPELL,
    WEAPON
}

enum HsMinionType {
    NONE,
    BEAST,
    MECH,
    DRAGON,
    MURLOCK,
    TOTEM
}

enum HsSet {
    BASIC,
    EXPERT,
    GOBLINS_VS_GNOMES,
    CUSTOM
}

enum HsHandLeaveEnum {
    PLAY,
    DISCARD
}

enum HsRarity {
    COMMON,
    RARE,
    EPIC,
    LEGENDARY
}