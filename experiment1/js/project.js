// project.js - purpose and description here
// Author: Your Name
// Date:

class OpeningScroller{
  #minEpisode = 10;
  #maxEpisode = 90;
  #TITLES; #TITLE_TEMPLATE; 
  #FILLERS; #STATIC_FILLS; #SCROLL_TEMPLATE;

  constructor(){
    this.#FILLERS = {
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
      glup: ["Princess Leia", "Glup", "George", "Geo'rge", "Luke", "Wo'man", "A'aa'aa aa", "Boingo", "Mitth'raw", "Paul", "Jonb", "Skleebis", "Keetu", "Meep o", "Oingo", "Shirt", "Peeblick", "Sneet Snart", "Guy", "Zaphod"],
      shitto: ["Organa", "Shitto", "Atreides", "Boingo", "Pan'ts", "Skywalker", "the Butt", "the Glorb", "Snee'ble", "Lone", "Metaphor", "Christ", "Lucas", "the Guy", "the Sh'lirp", "the Mo'oden", "Beeblebrox", "Johnson"],
      goes: ["races", "hurries", "sneaks", "meanders", "rolls", "skitters", "rushes", "flies", "flees", "vamooses", "glides", "shoots", "speeds", "goes"],
      where: ["home", "to Coruscant", "to the base", "to the Ascendancy", "to Tatooine", "to Glorbis", "to B", "to the temple", "to a cafe", "to headquarters", "to another galaxy", "to the Bleeble", "to Hoth", "to Dantooine", "to Alderaan"],
      preposition: ["aboard", "on", "in", "via", "with"],
      pronoun: ["her", "his", "their", "its"],
      vehicle: ["starship", "astrovan", "teleporter", "ship", "starfighter", "space station", "cruiser", "corvette", "space scooter", "speederbike", "speeder"],
      do_what: ["save", "warn", "free", "hide", "rescue", "liberate", "defend", "preserve", "prepare", "conceal", "shield", "help", "bolster", "arm", "support", "weaponize"],
      people: ["people", "gentry", "community", "family", "species", "homies", "friends", "family", "loved ones", "tribe", "clan", "kin", "folk", "horde", "posse", "society", "sisters", "brothers", "cousins", "parents", "pets", "worms", "guys"],
      end_state : ["freedom", "peace", "hope", "democracy", "chill vibes", "beauty", "happiness", "safety", "autonomy", "self-determination", "normalcy", "power", "fun", "livelihood"],

      // titles
      // articles built in to noun
      // then, IF FIRST WORD ISNT ADJ. give a 50/50 change of there being a "THE" at the start of the title (literally 5/9 of the movies have it sooo...)
      // IF TITLE IS < 3 WORDS, ADD A THE AT THE START
      // TODO:  - find a better solution than building articles into adjectives and placing "THE"s randomly 
      //        - handle plurals better
      adjective: ["THE PHANTOM", "A NEW", "THE LAST", "AN IMPERIAL", "THE GALACTIC", "A DISTANT", "AN OLD", "A COSMIC", "THE HORRIBLE", "A GHASTLY", "THE FIRST", "THE SECOND", "THE FORTIETH", "THE REBELLIOUS", "THE FREE", "A STARRY", "A LONELY", "THE GOOD", "THE BAD", "THE UGLY"],
      noun: ["FORCE", "MENACE", "HOPE", "GALAXY", "BATTLE", "WARRIOR", "KNIGHT", "PILOT", "BOUNTY HUNTER", "SCOUNDREL", "PRINCESS", "OUTLAW", "SMUGGLER", "COMMANDER", "FLEET", "LEGION", "FORTRESS", "DUEL", "ORBIT", "SABER", "HOLOCRON", "PROPHECY", "TEMPLE", "SHADOW", "LIGHT", "BLASTER"],
      faction: ["EMPIRE", "JEDI", "SITH", "CLONE", "REBELLION", "ALLIANCE", "SEPARATIST", "CHISS", "GRYSK", "FIRST ORDER", "HAPES", "BROTHERHOOD", "SISTERHOOD", "KNIGHT OF REN", "ACOLYTE", "WHILL GUARDIAN", "REPUBLIC", "RESISTANCE", "PARTISAN", "PHEONIX SQUADRON", "MANDALORIAN", "CRIMSON DAWN", "SYNDICATE", "SYNDICURE"],
      verb: ["AWAKENS", "STRIKES BACK", "CLASHES", "DUELS", "CONQUERS", "INVADES", "DESTROYS", "SUMMONS", "SENSES", "CONTROLS", "DOMINATES", "LEVITATES", "SHROUDS", "ENLIGHTENS", "SOARS", "EVADES", "COMMANDS", "LEADS", "BETRAYS", "ASCENDS", "FALLS", "CORRUPTS", "SHATTERS", "WHISPERS"],
      action_noun: ["ATTACK", "REVENGE", "RETURN", "RISE", "ASSAULT", "INVASION", "STRIKE", "RAID", "AMBUSH", "REVOLT", "UPRISING", "ONLSLAUGHT", "SIEGE", "CHARGE", "DUEL", "BATTLE", "WAR", "RETRIBUTION", "BETRAYAL", "DOWNFALL", "SACRIFICE", "CORRUPTION", "EXILE", "DOOM", "DESTRUCTION", "REDEMPTION", "ASCENSION", "AWAKENING", "LIBERATION", "PROPHECY", "FALL", "FLIGHT", "EXODUS"],
    };

    this.#STATIC_FILLS = new Map();  // will hold indeces for static filler items

    // TITLE GENERATION
    this.#TITLES = [
      `$adjective $noun`,             // ex: THE PHANTOM MENACE   // a(n) can be a problem later on
      `$adjective $faction`,          // ex: THE LAST JEDI        // a(n) can be a problem later on
      `$noun $verb`,                  // ex: THE FORCE AWAKENS
      `$action_noun OF THE $faction`, // ex: REVENGE OF THE SITH  
      `$faction $verb`,               // ex: THE EMPIRE STRIKES BACK
      `$action_noun OF $shitto`,      // ex: THE RISE OF SKYWALKER
    ]
    
    this.#TITLE_TEMPLATE;

    // SCROLL GENERATION    
    // template modeled after Star Wars: A New Hope opening crawl
    // https://starwars.fandom.com/wiki/Opening_crawl --> Film crawls --> Episode IV, A NEW HOPE
    this.#SCROLL_TEMPLATE = `
    It is $timeframe of $start_state. |good_guys $items, striking from $location, have $winstate their $numberth |campaign against the $bad_guys_descriptor |bad_guys. 

    During the |campaign, |good_guys $good_title managed to $good_title_actions $what_descriptor plans to the |bad_guys's $weapon_descriptor_1 weapon, the $weapon_name_A $weapon_name_B, $weapon_descriptor_2 $weapon_class with enough $weapon_threat to $weapon_action an entire $place. 

    Pursued by the |bad_guys's $bad_title_descriptor $bad_title, $glup $shitto $goes $where $preposition |pronoun $vehicle, custodian of the plans that can $do_what |pronoun $people and restore $end_state to the galaxy....
    `;  
  }

  #wordCount(str){
    // yoinked this function from Pravin M, via Medium
    // https://frontendinterviewquestions.medium.com/how-to-get-count-words-in-string-using-javascript-93baf76beb9b
    const wordsArray = str.trim().split(/\s+/).filter(word => word.length > 0);
    return wordsArray.length;
  }

  #getRomanNumeral(){
    let num = Math.floor(Math.random() * (this.#maxEpisode - this.#minEpisode + 1))

    // converting decimal to roman code is 'roman-numeral-convert.js' by @nickihastings on github
    // https://gist.github.com/nickihastings/df9d751a11bfb7b1e02a4d041e827d8d 
    var singles = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    var tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
    var hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
    var thousands = ["", "M", "MM", "MMM", "MMMM"];

    //turn the number to a string, split individual characters and then turn each one to a number.
    var length = num.toString().length;
    var numbers = num.toString().split("").map(Number);
    var roman = '';
    var i = 0;
    
    switch (length) {
        
      case 4:
        roman = thousands[numbers[i]];
        i++;
        
      case 3:
        roman += hundreds[numbers[i]];
        i++;
        
      case 2:
        roman += tens[numbers[i]];
        i++;
        
      case 1 :
        roman += singles[numbers[i]];
    }
   return roman;
  }

  #replacer(match, name) {
    let options = this.#FILLERS[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  // handle static fillers
  #setter(match, name) {
    let options = this.#FILLERS[name];
    if (options) {
      if(!this.#STATIC_FILLS.has(name)){
        this.#STATIC_FILLS.set(name, Math.floor(Math.random() * options.length));
      }
      return options[this.#STATIC_FILLS.get(name)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }

  #generate(template){
    const slotPattern = /\$(\w+)/;
    const staticSlotPattern = /\|(\w+)/;  // static filler items
  
    this.#STATIC_FILLS.clear();  // clear static fill indeces to prevent sticky fill on reroll
    while (template.match(slotPattern)) {
      template = template.replace(
        slotPattern, 
        (match, name) => this.#replacer(match, name)   // got this scoping fix from chat GPT (preverving 'this' when using replace())
      );
    }
    while (template.match(staticSlotPattern)) {
      template = template.replace(
        staticSlotPattern, 
        (match, name) => this.#setter(match, name)
      );
    }

    return template;  // filled in
  }
  
  /*** PUBLIC METHODS ***/
  generateScroll() {
    return this.#generate(this.#SCROLL_TEMPLATE);
  }

  generateTitle() {
    let chance = 5;
    let templateIndex = Math.floor(Math.random() * this.#TITLES.length);
    this.#TITLE_TEMPLATE = `${this.#TITLES[templateIndex]}`

    let title = this.#generate(this.#TITLE_TEMPLATE).toUpperCase();
    if(this.#wordCount(title) < 3) { // prepend with "the" if too short
      title = `THE ${title}`; 
      chance = 11;    // makes it impossible for another "the" to be randomly added
    }    

    // random chance to prepend with the
    if(templateIndex > 1){  // indeces 0 and 1 start with adjectives, so they can't be prepended
      let coinflip = (Math.random() * 10) >= chance;
      if(coinflip) title = `THE ${title}`; 
    }

    // add episode number
    let number = `EPISODE ${this.#getRomanNumeral()}`;

    title = `${number}\n${title}`
    return title;
  }
}

/*** DEBUG 
function main() {
  let scroll = new OpeningScroller();
  let generateScroll = scroll.generateScroll();

  // global box 
  //$(DIV_ID).text(generateScroll);
}

// let's get this party started - uncomment me
main();

// global clicker 
$("#clicker").click(main);
***/