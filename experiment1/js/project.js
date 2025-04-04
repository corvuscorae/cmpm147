// project.js - purpose and description here
// Author: Your Name
// Date:

class OpeningScroller{
  constructor(){
    this.FILLERS = {
    timeframe: ["a period", "an epoch", "an era", "a day", "a century", "a decade", "a month", "a week", "an hour"],
    start_state: ["civil war", "agony", "hardship", "hunger", "danger", "food fights", "silly guys doing things", "boredom", "fascism", "oligarchy", "unchill vibes"],
    good_guys: ["Rebel", "Jedi", "Gleep Glorpian", "Chiss", "Gungan", "Based Wizard", "Mandalorian", "Swamp", "Pirate", "Cool Guy", "Clone Trooper", "Twi'lek Freedom Fighter", "Tusken Raider", "Nite Owl"],
    items: ["spaceships", "speeders", "scooters", "freighters", "guys", "godzillas", "lisan al-gaibs", "big worms", "sabermen", "blastermen", "gravity wells"],
    location: ["a hidden base", "an underground lair", "a moon", "an asteroid", "a fake asteroid", "a hyperspace route", "the Chaos", "Coruscant", "Tatooine", "Jakku", "Arrakis"],
    winstate: ["won", "tied", "lost"],
    numberth : ["first", "second", "third", "forty-second", "last", "penultimate", "lastest", "seventh"],
    campaign: ["battle", "campaign", "fight", "card game", "pissing contest", "dogfight", "clash", "struggle", "skirmish", "confrontation"],
    bad_guys_descriptor : ["evil", "uncool", "mean", "bad", "nasty", "terrifying", "malicious", "ugly", "hateful", "villainous", "nauseating", "embarassing", "vile", "reprobate", "malignant", "repulsive"],
    bad_guys: ["Galactic Empire", "Separatists", "Sith", "Nightsisters", "Grysk", "Confederacy", "First Order", "Death Watch", "Hutts", "Intergalactic Banking Clan", "Unchill Guys", "Creepy Crawlies"],
    good_title: ["spies", "pilots", "analysts", "bakers", "teachers", "gamers", "officers", "grunts", "guys", "bugs", "glorps", "window washers", "agents", "farmers", "warriors", "fighters", "leaders", "troopers"],
    good_title_actions : ["steal", "take", "find", "borrow", "yoink", "grab", "purloin", "loot", "pilfer", "swipe", "locate", "plunder"],
    what_descriptor: ["secret", "scary", "intensive", "complete", "incomplete", "silly", "useless", "groundbreaking", "awesome", "unchill", "annoying", "doomsday"],
    weapon_descriptor_1 : ["ultimate", "mega", "incredible", "awe-inspiring", "alarming", "grim", "hideous", "large", "stinky", "kinda cool", "impressive", "unimpressive", "horrible", "shameful"],
    weapon_name_A: ["DEATH", "MASSIVE", "EVISCERATING", "DESCRUCTION", "DOOM", "SPIKED", "RADIATED", "CATACLYSM", "DISASTER", "CALAMITY", "BAD", "UH-OH", "END", "STAR"],
    weapon_name_B: [ "STAR", "FLASH", "SPIKE", "GUN", "RAY", "BEAM", "LAZER", "SABER", "BLASTER", "KNIFE", "WORM", "FIST", "SHIP", "DAGGER", "FLAME", "GUY", "CANNON", "MISSILE", "SCYTHE"],
    weapon_descriptor_2: ["an armored", "a massive", "an efficient", "an atomic", "a microscopic", "a cataclysmic", "a dangerous", "a tiered", "a hierarchical", "a shifting", "an invisible", "a litte"],
    weapon_class: ["space station", "gun", "sword", "lightsaber", "moon", "not-moon", "bomb", "firework", "spacecraft", "device", "algorithm", "worm", "guy", "rocket", "pill", "virus", "fungus", "application", "holomail scam"],
    weapon_threat: ["power", "energy", "force", "weight", "clout", "strength", "heat", "devastation", "zest", "ferocity", "fury", "magnitude", "severity", "violence", "potency"],
    weapon_action: ["destroy", "influence", "atomize", "disappear", "hide", "explode", "freeze", "banish", "set fire to", "kill", "maim", "ravage", "gut", "flatten", "enshittify", "crinkle", "bend"],
    place: ["planet", "city", "sector", "galaxy", "star", "star system", "house", "civilization", "ship", "clone army", "army", "government", "concept", "timeline", "universe"],
    bad_title_descriptor : ["sinister", "evil", "kind of hot", "goofy", "creepy", "funny", "unchill", "evangelical", "mischievous", "ominous", "woeful", "harmful", "foreboding", "all-powerful", "corrupt"],
    bad_title: ["spies", "pilots", "nerds", "reviewers", "economists", "cops", "officers", "grunts", "guys", "bugs", "glorps", "window dirtiers", "agents", "farmers", "warriors", "fighters", "leaders", "troopers"],
    glup: ["Princess", "Glup", "George", "Geo'rge", "Luke", "Wo'man", "A'aa'aa aa", "Boingo", "Mitth'raw", "Paul", "Jonb", "Skleebis", "Keetu", "Meep o", "Oingo", "Shirt", "Peeblick", "Sneet Snart", "Guy", "Zaphod"],
    shitto: ["Leia", "Shitto", "Atreides", "Boingo", "Pan'ts", "Skywalker", "the Butt", "the Glorb", "Snee'ble", "Lone", "Metaphor", "Christ", "Lucas", "the Guy", "the Sh'lirp", "the Mo'oden", "Beeblebrox", "Johnson"],
    goes: ["races", "hurries", "sneaks", "meanders", "rolls", "skitters", "rushes", "flies", "flees", "vamooses", "glides", "shoots", "speeds", "goes"],
    where: ["home", "to Coruscant", "to the base", "to the Ascendancy", "to Tatooine", "to Glorbis", "to B", "to the temple", "to a cafe", "to headquarters", "to another galaxy", "to the Bleeble", "to Hoth", "to Dantooine", "to Alderaan"],
    preposition: ["aboard", "on", "in", "via", "with"],
    pronoun: ["her", "his", "their", "its"],
    vehicle: ["starship", "astrovan", "teleporter", "ship", "starfighter", "space station", "cruiser", "corvette", "space scooter", "speederbike", "speeder"],
    do_what: ["save", "warn", "free", "hide", "rescue", "liberate", "defend", "preserve", "prepare", "conceal", "shield", "help", "bolster", "arm", "support", "weaponize"],
    people: ["people", "gentry", "community", "family", "species", "homies", "friends", "family", "loved ones", "tribe", "clan", "kin", "folk", "horde", "posse", "society", "sisters", "brothers", "cousins", "parents", "pets", "worms", "guys"],
    end_state : ["freedom", "peace", "hope", "democracy", "chill vibes", "beauty", "happiness", "safety", "autonomy", "self-determination", "normalcy", "power", "fun", "livelihood"],
    };

    this.STATIC_FILLS = new Map();  // will hold indeces for static filler items

    this.TEMPLATE = 
    `
    It is $timeframe of $start_state.
    |good_guys $items, striking
    from $location, have $winstate
    their $numberth |campaign against
    the $bad_guys_descriptor |bad_guys.
    
    During the |campaign, |good_guys
    $good_title managed to $good_title_actions $what_descriptor
    plans to the |bad_guys's
    $weapon_descriptor_1 weapon, the $weapon_name_A
    $weapon_name_B, $weapon_descriptor_2 $weapon_class
    with enough $weapon_threat to
    $weapon_action an entire $place.
    
    Pursued by the |bad_guys's
    $bad_title_descriptor $bad_title, $glup
    $shitto $goes $where $preposition |pronoun
    $vehicle, custodian of the
    plans that can $do_what
    |pronoun $people and restore
    $end_state to the galaxy....
    `;  

  }

  replacer(match, name) {
    let options = this.FILLERS[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  // handle static fillers
  setter(match, name) {
    let options = this.FILLERS[name];
    if (options) {
      if(!this.STATIC_FILLS.has(name)){
        this.STATIC_FILLS.set(name, Math.floor(Math.random() * options.length));
      }
      return options[this.STATIC_FILLS.get(name)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  generate() {
    let story = this.TEMPLATE;
    const slotPattern = /\$(\w+)/;
    const staticSlotPattern = /\|(\w+)/;  // static filler items
  
    this.STATIC_FILLS.clear();  // clear static fill indeces to prevent sticky fill on reroll
    while (story.match(slotPattern)) {
      story = story.replace(
        slotPattern, 
        (match, name) => this.replacer(match, name)   // got this scoping fix from chat GPT (preverving 'this' when using replace())
      );
    }
    while (story.match(staticSlotPattern)) {
      story = story.replace(
        staticSlotPattern, 
        (match, name) => this.setter(match, name)
      );
    }
    /* global box */
    $("#box").text(story);
  }
}

function main() {
  let scroll = new OpeningScroller();
  let generate = scroll.generate();
}


// let's get this party started - uncomment me
main();

/* global clicker */
$("#clicker").click(main);