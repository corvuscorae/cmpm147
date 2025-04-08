// project.js - Generates a Star Wars-like opening crawl using simple grammars and a template modeled after the A New Hope crawl
//            - Also generates titles from an array of templates modeled after the nin Star Wars films' titles.
//            - This project was originally remixed on Glitch from Adam Smith's bad-quests (https://glitch.com/~bad-quests).
// Author: Your Name
// Date:

class OpeningScrawler{
  #minEpisode = 10;
  #maxEpisode = 90;
  #FUNCTION_MAP;  // a map that holds all functions for function-calling slots
  #TITLES; #TITLE_TEMPLATE; 
  #FILLERS; #STATIC_FILLS; #SCRAWL_TEMPLATE;

  constructor(){
    this.#FILLERS = {
      timeframe: ["a period", "an epoch", "an era", "a day", "a century", "a decade", "a month", "a week", "an hour", "a time", "a millennium", "an age", "a generation", "a cycle", "an eon", "a lifetime"],
      start_state: ["civil war", "war", "conflict", "trouble", "turmoil", "agony", "hardship", "hunger", "danger", "boredom", "fascism", "oligarchy", "unchill vibes", "strife", "hardship", "disarray", "drama", "insanity", "pain", "discord", "disaster", "unruliness", "chaos", "stupidity", "depression", "oppression", "dictatorship", "tyranny", "autocracy"],
      end_state : ["freedom", "peace", "hope", "democracy", "chill vibes", "beauty", "happiness", "safety", "autonomy", "self-determination", "normalcy", "power", "fun", "livelihood", "harmony", "tranquility", "calm", "serenity", "comfort", "joy", "whimsy", "independence", "sovereignty", "liberty", "good vibes", "civility", "goodness", "love", "starlight"],
      
      bad_guys: ["Galactic Empire", "Separatists", "Sith", "Nightsisters", "Grysk", "Confederacy", "First Order", "Death Watch", "Hutts", "Intergalactic Banking Clan", "Unchill Guys", "Creepy Crawlies", "Agbui", "Nikardun", "Gr'buigs", "Space American Military", "Inquisitors", "Crimson Dawn", "Pyke Syndicate", "Hutt Cartel"],
      bad_title: ["spies", "pilots", "nerds", "reviewers", "economists", "cops", "officers", "grunts", "guys", "bugs", "glorps", "window dirtiers", "agents", "farmers", "warriors", "fighters", "leaders", "troopers"],
      bad_guys_descriptor : ["", "sinister", "evil", "kind of hot", "goofy", "creepy", "funny", "unchill", "evangelical", "mischievous", "ominous", "woeful", "harmful", "foreboding", "all-powerful", "corrupt", "evil", "uncool", "bad", "nasty", "terrifying", "malicious", "ugly", "hateful", "villainous", "nauseating", "vile", "reprobate", "malignant", "repulsive", "awful", "dastardly", "infamous", "terrible", "iron-fisted", "powerful", "brutal", "bloodthirsty"],

      good_guys: ["Rebel", "Jedi", "Gleep Glorpian", "Chiss", "Gungan", "Cool Guy", "Based Wizard", "Mandalorian", "Swamp", "Pirate", "Clone", "Twi'lek Freedom Fighter", "Tusken Raider", "Nite Owl", "Outlaw", "Independent", "Alien", "Frem'en", "No'stali'gia", "Paccosh"],
      good_title: ["spies", "pilots", "analysts", "bakers", "teachers", "gamers", "officers", "grunts", "guys", "bugs", "glorps", "window washers", "agents", "farmers", "warriors", "fighters", "leaders", "troopers", "politicians", "scouts", "vanguards", "commandos", "instructors", "guardians", "defenders"],
      good_title_actions : ["steal", "take", "find", "borrow", "yoink", "grab", "purloin", "loot", "pilfer", "swipe", "locate", "plunder", "decipher", "discover", "obtain", "decrypt", "hack", "uncover", "recover", "work out", "reveal", "lift", "publish"],
      verbing: ["striking", "operating", "surveilling", "working", "shooting", "fighting", "battling", "resisting", "assaulting", "jousting", "challenging", "engaging", "launching", "activating", "departing", "starting", "fleeing", "escaping", "joining"],
      items: ["spaceships", "speeders", "star scooters", "freighters", "guys", "big worms", "sabermen", "blastermen", "gravity wells", "detonators", "fighters", "Walkers", "firesprays", "astromech", "droids", "assassins", "buzz droids", "interceptors", "ion drives", "warp arrays"],
      location: ["a hidden base", "an underground lair", "Glorbis", "the Bleeble", "Hoth", "Dantooine", "Beeb", "the temple", "a cafe", "the Ascendancy", "a moon", "an asteroid", "a fake asteroid", "a hyperspace route", "the Chaos", "Coruscant", "Tatooine", "Jakku", "Arrakis", "Alderaan", "New Alderaan", "Naboo", "Bespin", "Ord Mantell", "Kashyyyk", "Ryloth", "Endor", "Mustafar", "Jedha", "Dathomir", "Ilum", "Mandalore", "Lysatra", "Csilla"],

      winstate_qualifier: ["barely", "almost", "nearly", "already", "completely", "", "", "", "", "", "", ""],
      winstate: ["won", "lost"],
      whenifier : ["", "***", "first", "last", "penultimate", "latest", "recent", "brief", "lengthy", "inaugural", "terminal", "final"],
      campaign: ["battle", "campaign", "fight", "dogfight", "clash", "struggle", "skirmish", "confrontation", "siege", "uprising", "assault", "engagement", "onslaught", "insurrection", "incursion", "stand-off", "fray", "scuffle", "firefight", "maneuver", "retaliation", "counterstrike"],

      what_descriptor: ["secret", "scary", "intensive", "complete", "incomplete", "silly", "useful", "groundbreaking", "awesome", "unchill", "doomsday", "classified", "shadowy", "hidden", "covert", "dire", "hellish", "twisted", "extreme", "wicked", "funky"],
      weapon_descriptor_1 : ["ultimate", "mega", "incredible", "awe-inspiring", "alarming", "grim", "hideous", "large", "stinky", "kinda cool", "impressive", "comprehensive", "horrible", "shameful", "unprecedented", "titanic", "mythic", "supreme", "streamlined", "fatal"],
      weapon_name_A: ["DEATH", "MASSIVE", "EVISCERATING", "DESTRUCTION", "DOOM", "SPIKED", "RADIATED", "CATACLYSM", "DISASTER", "CALAMITY", "BAD", "UH-OH", "END", "STAR", "TWISTED", "HELL", "CHAOS", "PURIFYING", "ANOMALY", "SHADOW", "GHOST", "ABYSS", "FINALITY", "BOLT", "PIECING", "GLOOM", "HUNT", "ROGUE", "AGENT", "JUGGERNAUT", "ENDING", "PIECING"],
      weapon_name_B: [ "STAR", "FLASH", "SPIKE", "GUN", "RAY", "BEAM", "LAZER", "SABER", "BLASTER", "KNIFE", "WORM", "FIST", "SHIP", "DAGGER", "FLAME", "GUY", "CANNON", "MISSILE", "SCYTHE", "NOVA", "COMET", "QUASAR", "VOID", "ION", "NEBULA", "SPARK", "FANG", "CLAW", "GRINDER", "DRILL", "HOOK", "SHIV", "DRIVE", "CORTEX", "WRAITH", "SWARM", "FLASH"],
      weapon_descriptor_2: ["an armored", "a massive", "an efficient", "an atomic", "a microscopic", "a cataclysmic", "a dangerous", "a tiered", "a hierarchical", "a shifting", "an invisible", "a little", "a quantum", "a reactive", "a cybernetic", "a nanofiber", "a gravitational", "a lethal", "a hellish", "a corrosive", "a sentient", "a possessed", "a plasma"],
      weapon_class: ["space station", "gun", "sword", "lightsaber", "moon", "not-moon", "bomb", "firework", "spacecraft", "device", "algorithm", "worm", "guy", "rocket", "pill", "virus", "fungus", "application", "holomail scam", "drone swarm", "grav cannon", "nanite swarm", "orbital array", "spore", "mind-virus", "satellite", "blicky"],
      weapon_threat: ["power", "energy", "force", "weight", "clout", "strength", "heat", "devastation", "zest", "ferocity", "fury", "magnitude", "severity", "violence", "potency", "pressure", "havoc", "charge", "voltage", "radiance", "recoil", "madness", "grit", "vibes", "tension", "meme density"],
      weapon_action: ["destroy", "influence", "atomize", "disappear", "hide", "explode", "freeze", "banish", "set fire to", "kill", "maim", "ravage", "gut", "flatten", "enshittify", "crinkle", "bend", "bifurcate", "dissect", "blow up", "debone", "dismantle", "demolish", "wreck", "shatter", "annihilate", "erode", "raze", "subdue", "pulverize", "remove", "tear down"],

      place: ["planet", "city", "sector", "galaxy", "star", "star system", "house", "civilization", "starship", "clone army", "army", "government", "concept", "timeline", "universe", "multiverse", "cinematic universe", "franchise", "society", "culture", "neighborhood", "city block", "snooble", "life"],
      
      glup: ["***", "Princess Leia", "Glup", "George", "Geo'rge", "Luke", "Wo'man", "A'aa'aa aa", "Boingo", "Mitth'raw", "Paul", "Jonb", "Skleebis", "Keetu", "Meep o", "Oingo", "Shirt", "Peeblick", "Sneet Snart", "Guy", "Zaphod"],
      shitto: ["***", "Organa", "Shitto", "Atreides", "Boingo", "Pan'ts", "Skywalker", "the Butt", "the Glorb", "Snee'ble", "Lone", "Metaphor", "Christ", "Lucas", "the Guy", "the Sh'lirp", "the Mo'oden", "Beeblebrox", "Johnson"],
      goes: ["races", "hurries", "sneaks", "meanders", "rolls", "skitters", "rushes", "flies", "flees", "vamooses", "glides", "shoots", "speeds", "goes", "proceeds", "advances", "forges on", "pushes", "drives", "gets", "departs", "leaves", "peels off", "steps", "books it", "absconds", "hustles", "scrambles", "rushes", "meebles"],
      where: ["***", "home", "to the base", "to headquarters", "to another galaxy"],
      preposition: ["aboard", "on", "in", "via", "with"],
      pronoun: ["her", "his", "their", "its", "xir"],
      vehicle: ["starship", "astrovan", "teleporter", "ship", "starfighter", "space station", "cruiser", "corvette", "space scooter", "speederbike", "speeder", "ship", "star barge", "void crawler", "transport", "nis-san", "2015 Kia Forte hatchback", "warpbike", "gravity shifter", "solar sailer", "lambda", "TIE fighter", "X-Wing", "A-Wing", "Interceptor", "flying saucer", "cruiser", "man-of-war", "clawcraft", "glider"],
      do_what: ["save", "warn", "free", "rescue", "liberate", "defend", "preserve", "prepare", "shield", "help", "bolster", "arm", "support", "weaponize", "radicalize", "mobilize", "stop", "destroy", "untether", "unify", "enlist", "release", "bail out", "emancipate", "unbind", "awaken", "educate", "ruin", "trick", "frighten", "motivate"],
      people: ["people", "gentry", "community", "family", "species", "homies", "friends", "family", "loved ones", "tribe", "clan", "kin", "folk", "horde", "posse", "society", "sisters", "brothers", "cousins", "parents", "pets", "worms", "guys", "husband", "wife", "spouse", "relatives", "children", "partner", "team", "army", "fan club", "droids"],
      
      // titles
      // articles built in to noun
      // then, IF FIRST WORD ISNT ADJ. give a 50/50 chance of there being a "THE" at the start of the title (literally 5/9 of the movies have it sooo...)
      // IF TITLE IS < 3 WORDS, ADD A THE AT THE START
      // TODO:  - find a better solution than building articles into adjectives and placing "THE"s randomly
      //        - handle plurals better
      adjective: ["THE PHANTOM", "A NEW", "THE LAST", "AN IMPERIAL", "THE GALACTIC", "A DISTANT", "AN OLD", "A COSMIC", "THE HORRIBLE", "A GHASTLY", "THE FIRST", "THE SECOND", "THE FORTIETH", "THE REBELLIOUS", "THE FREE", "A STARRY", "A LONELY", "THE GOOD", "THE BAD", "THE UGLY"],
      noun: ["FORCE", "MENACE", "HOPE", "GALAXY", "BATTLE", "WARRIOR", "KNIGHT", "PILOT", "BOUNTY HUNTER", "SCOUNDREL", "PRINCESS", "OUTLAW", "SMUGGLER", "COMMANDER", "FLEET", "LEGION", "FORTRESS", "DUEL", "ORBIT", "SABER", "HOLOCRON", "PROPHECY", "TEMPLE", "SHADOW", "LIGHT", "BLASTER"],
      faction: ["EMPIRE", "JEDI", "SITH", "CLONE", "REBELLION", "ALLIANCE", "SEPARATIST", "CHISS", "GRYSK", "FIRST ORDER", "HAPES", "BROTHERHOOD", "SISTERHOOD", "KNIGHT OF REN", "ACOLYTE", "WHILL GUARDIAN", "REPUBLIC", "RESISTANCE", "PARTISAN", "PHOENIX SQUADRON", "MANDALORIAN", "CRIMSON DAWN", "SYNDICATE", "SYNDICURE"],
      verb: ["AWAKENS", "STRIKES BACK", "CLASHES", "DUELS", "CONQUERS", "INVADES", "DESTROYS", "SUMMONS", "SENSES", "CONTROLS", "DOMINATES", "LEVITATES", "SHROUDS", "ENLIGHTENS", "SOARS", "EVADES", "COMMANDS", "LEADS", "BETRAYS", "ASCENDS", "FALLS", "CORRUPTS", "SHATTERS", "WHISPERS"],
      action_noun: ["ATTACK", "REVENGE", "RETURN", "RISE", "ASSAULT", "INVASION", "STRIKE", "RAID", "AMBUSH", "REVOLT", "UPRISING", "ONLSLAUGHT", "SIEGE", "CHARGE", "DUEL", "BATTLE", "WAR", "RETRIBUTION", "BETRAYAL", "DOWNFALL", "SACRIFICE", "CORRUPTION", "EXILE", "DOOM", "DESTRUCTION", "REDEMPTION", "ASCENSION", "AWAKENING", "LIBERATION", "PROPHECY", "FALL", "FLIGHT", "EXODUS"],
    };

    this.#STATIC_FILLS = new Map();  // will hold indeces for static filler items

    // TITLE GENERATION
    this.#TITLES = [
      `$adjective $noun`,             // ex: THE PHANTOM MENACE   
      `$adjective $faction`,          // ex: THE LAST JEDI        
      `$noun $verb`,                  // ex: THE FORCE AWAKENS
      `$action_noun OF THE $faction`, // ex: REVENGE OF THE SITH  
      `$faction $verb`,               // ex: THE EMPIRE STRIKES BACK
      `$action_noun OF #shitto`,      // ex: THE RISE OF SKYWALKER
    ]
    
    this.#TITLE_TEMPLATE;

    // SCRAWL GENERATION    
    // template modeled after Star Wars: A New Hope opening crawl
    // https://starwars.fandom.com/wiki/Opening_crawl --> Film crawls --> Episode IV, A NEW HOPE
    // usage: $ -> standard random filler replacement
    //        | -> static filler, remains the same throughout template's resulting string
    //        # -> function filler, calls function defined in FUNCTION_MAP
    this.#SCRAWL_TEMPLATE = `
    It is $timeframe of $start_state. |good_guys $items, $verbing from $location, have $winstate their #whenifier |campaign against the $bad_guys_descriptor |bad_guys. 

    During the |campaign, |good_guys $good_title managed to $good_title_actions $what_descriptor plans to the |bad_guys's $weapon_descriptor_1 weapon, the $weapon_name_A $weapon_name_B, $weapon_descriptor_2 $weapon_class with enough $weapon_threat to $weapon_action an entire $place. 

    Pursued by the |bad_guys's $bad_guys_descriptor $bad_title, #glup #shitto $goes #where $preposition |pronoun $vehicle, custodian of the plans that can $do_what |pronoun $people and restore $end_state to the galaxy....
    `;  

    this.#FUNCTION_MAP = {
      "#whenifier": this.#whenifier(), // chooses a temporal adjective, including ordinals
      "#glup": this.#glupShittofier("glup"),
      "#shitto": this.#glupShittofier("shitto"),
      "#where": this.#pickWhere() //() => { console.log("WHERE"); return "WHERE"},
    }

    //console.log(this.#glupShittofier());
  }

  //*** HELPERS ***//
  #ordinalOf(n){
    // convert a number (1, 2, 3) to its ordinal (first, second, third), 
    // works for n < 100
    let ordinal = ""
    let units = n % 10;
    let tens = Math.floor(n / 10) % 10;

    switch(units){
      case 0:
        break;
      case 1:
        ordinal = "first";
        break;
      case 2:
        ordinal = "second";
        break;
      case 3:
        ordinal = "third";
        break;
      case 4:
        ordinal = "fourth";
        break;
      case 5:
        ordinal = "fifth";
        break;
      case 6:
        ordinal = "sixth";
        break;
      case 7:
        ordinal = "seventh";
        break;
      case 8:
        ordinal = "eighth";
        break;
      case 9:
        ordinal = "ninth";
        break;
    }
    //n -= units;
    
    switch(tens){
      case 1:
        switch(units){
          case 1:
            ordinal = "eleventh";
            break;
          case 2:
            ordinal = "twelfth";
            break;
          case 3:
            ordinal = "thirteenth";
            break;
          case 4:
            ordinal = "fourteenth";
            break;
          case 5:
            ordinal = "fifteenth";
            break;
          case 6:
            ordinal = "sixteenth";
            break;
          case 7:
            ordinal = "seventeenth";
            break;
          case 8:
            ordinal = "eighteenth";
            break;
          case 9:
            ordinal = "ninteenth";
            break;
        }
        break;
      case 2:
        ordinal = (units != 0) ? "twenty-" + ordinal : "twentieth";
        break;
      case 3:
        ordinal = (units != 0) ? "thirty-" + ordinal : "thirdieth";
        break;
      case 4:
        ordinal = (units != 0) ? "forty-" + ordinal : "fortieth";
        break;
      case 5:
        ordinal = (units != 0) ? "fifty-" + ordinal : "fiftieth";
        break;
      case 6:
        ordinal = (units != 0) ? "sixty-" + ordinal : "sixtieth";
        break;
      case 7:
        ordinal = (units != 0) ? "seventy-" + ordinal : "seventieth";
        break;
      case 8:
        ordinal = (units != 0) ? "eighty-" + ordinal : "eightieth";
        break;
      case 9:
        ordinal = (units != 0) ? "ninety-" + ordinal : "nintieth";
        break;
    }
    //n -= Math.floor(n / 10) % 10 * 10;

    return ordinal;
  }

  #wordCount(str){
    // yoinked this function from Pravin M, via Medium
    // https://frontendinterviewquestions.medium.com/how-to-get-count-words-in-string-using-javascript-93baf76beb9b
    const wordsArray = str.trim().split(/\s+/).filter(word => word.length > 0);
    return wordsArray.length;
  }

  #getRomanNumeral(){
    let num = Math.floor(Math.random() * (this.#maxEpisode - this.#minEpisode) + this.#minEpisode)

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

  // make randonly generate glup shitto names more readable
  #nameImprover(name, letters){
    const MODIFIERS = [" ", "'", " of ", " the ", " foar "]

    // TODO:
    //    - break up long names with modifiers
    //    - increase number of mods based on how long name is
    //    - capitalize name pieces (separated by any modifier but "'")
    // ONCE THIS IS DONE, INCREASE NAME MAX LENGTH
    name = name.charAt(0).toUpperCase() + name.slice(1);

    // Q should be followed by u and a random vowel
    let nameQ = this.#findAllCharIndices(name, "q");
    for(let i = nameQ.length-1; i >= 0; i--){
      let currentQ = nameQ[i];

      // set improver
      let imporver = letters.vowel[Math.floor(Math.random()*letters.vowel.length)]
      if(imporver === "u"){ imporver = "'" + imporver}

      // insert improver
      if(currentQ === name.length-1){
        name = name + `u${imporver}`;
      } else{
        name = this.#insertStringAt(name, `u${imporver}`, currentQ + 1)
      }
    }

    // X should be followed by a vowel and/or a modifier
    let nameX = this.#findAllCharIndices(name, "x");
    for(let i = nameX.length-1; i >= 0; i--){
      let currentX = nameX[i];
      let chance = 0.5;

      // set improver
      let improver = (Math.random() > chance) ? "" : letters.vowel[Math.floor(Math.random()*letters.vowel.length)];
      if(currentX === name.length-1){ chance = 1; } // blocks modifiers at end of name
      improver = (Math.random() > chance) ? improver + MODIFIERS[Math.floor(Math.random()*MODIFIERS.length)] : ""; 
      if(improver === ""){
        improver = (Math.random() > chance) ? 
        improver + MODIFIERS[Math.floor(Math.random()*MODIFIERS.length)]
        : letters.vowel[Math.floor(Math.random()*letters.vowel.length)];

      }

      // insert improver 
      if(currentX === name.length-1){
        name = name + `${improver}`;
      } else{
        name = this.#insertStringAt(name, `${improver}`, currentX + 1)
      }
    }

    return name;
  }

  // thank you google AI overview!
  #findAllCharIndices(str, char) {
    const indices = [];
    let index = str.indexOf(char);
    while (index !== -1) {
      indices.push(index);
      index = str.indexOf(char, index + 1);
    }
    return indices;
  }

  #insertStringAt(orig, str, i) {
    const firstPart = orig.slice(0, i);
    const secondPart = orig.slice(i);

    return firstPart + str + secondPart;
  }

  //*** SLOT FILLING FUNCTIONS ***//
  // handle function fillers
  #glupShittofier(starter){  // throws together letters to make a name 
    let name = this.#setter(`#${starter}`, `${starter}`);
    if(name !== "***") { return name; }

    console.log("Building a Glup Shitto...");
    const LETTERS = {
      vowel: ["a", "e", "i", "o", "u", "y"],
      consonants: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"],

      // TODO: find or make a comprehensive library with more common consonant clusters in English
      //        - maybe also find the same for other languages
      // consonant clusters partially taken from this website:
      //  https://www.boldvoice.com/blog/consonant-clusters-in-english 
      notBackClusters: [ // likely to be found anywhere but the back
        "bl", "br", "cl", "cr", "fl", "fr", "gl", "gr", "pl", "pr", "str", "spr", "sc", "scr", "spl", "thr", 
        "tr", "wh", "sw", "dr", "pr", "wr", "sl", "shl"
      ],
      notFrontClusters: [  // likely to be found anywhere but the front
        "ct", "nt", "ck", "rl", "rm", "rn", "rp", "rs", "rb", "rc", "rck", "rd", "rf", "rk", "rt", "rth",
        "rv", "rs", "rsh", "rst", "lm", "ln", "lp"
      ],
      anywhereClusters: [
        "sk", "st", "sp", "sn", "ch", "gh", "ph", "sh", "th", "wh"
      ]
    }

    // generate a name template
    let nameTemplate = "";
    const chunkSlots = [
      "$vowel",  "$consonants", "$anywhereClusters", "$notFrontClusters","$notBackClusters"
    ]

    // TODO: can increase the max here when nameImprover is done
    const maxLength = Math.floor(Math.random() * (6 - 4) + 4);;
    const initSlots = Math.floor(Math.random() * (maxLength - 2) + 2);

    let chunkIndex = [];  
    for(let i = 0; i < initSlots; i++){
      let min = 0;
      let max = (chunkIndex[chunkIndex.length-1] > 0) ? 0 : chunkSlots.length;  // if last index is a consonant, force a vowel next
      let randIndex = Math.floor(Math.random() * (max - min) + min);
      
      // first chunk cant be notFrontCluster
      if(i === 0 && randIndex === chunkSlots.indexOf("$notFrontClusters")){ 
        while(randIndex === chunkSlots.indexOf("$notFrontClusters")){
          randIndex = Math.floor(Math.random() * (max - min) + min);
        }
      }

      // last chunnk cant be notBackCluster
      if(i === initSlots-1 && randIndex === chunkSlots.indexOf("$notBackClusters")){ 
        while(randIndex === chunkSlots.indexOf("$notBackClusters")){
          randIndex = Math.floor(Math.random() * (max - min) + min);
        }
      }

      chunkIndex.push(randIndex)
    }

    for(let i of chunkIndex){ nameTemplate += `${chunkSlots[i]}`; }

    name = this.#nameImprover(this.#generate(nameTemplate, LETTERS), LETTERS);
    return name;
  }

  #pickWhere(){
    let where = this.#setter("#where", "where");

    if(where === "***"){
      where = "to " + this.#setter("#location", "location");
    }
    return where;
  }

  #whenifier(){
    //console.log("HI")
    let when = this.#setter("#whenifier", "whenifier");
    if(when === "***"){
      let num = Math.floor(Math.random() * (99 - 1) + 1);
      when = this.#ordinalOf(num);
    }
    return when
  }

  // handle static fillers
  #setter(match, name, fillers) {
    if(!fillers){ fillers = this.#FILLERS; }
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

  // standard fillers
  #replacer(match, name, fillers) {
    if(!fillers){ fillers = this.#FILLERS; }
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }

  // generator (calls filler functions)
  #generate(template, fillers){
    //if(!fillers){ fillers = this.#FILLERS; }
    const slotPattern = /\$(\w+)/;
    const staticSlotPattern = /\|(\w+)/;  // static filler items
    const functionSlotPattern = /\#(\w+)/;  // calls a function to fill slot
  
    this.#STATIC_FILLS.clear();  // clear static fill indeces to prevent sticky fill on reroll
    while (template.match(slotPattern)) {
      template = template.replace(
        slotPattern, 
        (match, name) => this.#replacer(match, name, fillers)   // got this scoping fix from chat GPT (preverving 'this' when using replace())
      );
    }
    while (template.match(staticSlotPattern)) {
      template = template.replace(
        staticSlotPattern, 
        (match, name) => this.#setter(match, name, fillers)
      );
    }
    while (template.match(functionSlotPattern)) {
      template = template.replace(
        functionSlotPattern, 
        (match, name) => this.#FUNCTION_MAP[match]
      );
      
      // this.#FUNCTION_MAP
    }

    return template;  // filled in
  }
  
  /*** PUBLIC METHODS ***/
  generateScrawl() {
    return this.#generate(this.#SCRAWL_TEMPLATE);
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
