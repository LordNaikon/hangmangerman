//Created by www.twitch.tv/sk0mbie/
//edit by www.twitch.tv/LordNaikon82/
//Hangman plugin for PhantomBot v1.2

(function() {
	var currentWord = '',
	 	guessedWord = [],
	 	guessCount = 0,
	 	penalty = 10,
	 	prize = 30,  //Preis für jedes gefundene Wort
	 	difficulty = 7,  //Schwierigkeit
	 	trueDifficulty = 7,  //Wahre Schwierigkeit
	 	vowelCost = 20,    //Preis pro Buchstabe
	 	time = 10;   //Spielzeit in Minuten
		
	//Wörterliste 
	
	var words = ['Titanic', 
	             'Lambo',
				 'SCHIFFAHRTSGESELLSCHAFT',
				 'COMPUTERABSTURZ',
                 'VORSTANDSSPRECHER',
				 'MAGAZIN',
                 'ZUFALL',
                 'CYBERSEX',
                 'KONTAKTANZEIGEN',
                 'KOSTENPFLICHTIG',
                 'KREDITKARTE',
				 'EISENBAHN',
				 'WIRRUNGEN',
				 'FAMILIENLEBEN',
				 'ATLANTIK',
				 'TYPENVIELFALT',
				 'ZUGBEGLEITERINNEN',
				 'HOCHSOMMERTAG',
				 'KRATZER',
				 'ARBEITSINSTRUMENT',
				 'SERVERSTEUERUNG',
				 'AUSBLICK',
				 'NASENSCHLEIM',
				 'GANGSCHALTUNG',
				 'OPFER',
				 'REIS',
				 'ESSSTAEBCHEN',
				 'LIEGESTUHL',
				 'WASSERMELONE',
				 'STROHHALM',
				 'LAWINE',
				 'WEINTRAUBE',
				 'DATENVERARBEITUNG',
				 'PORZELLAN',
				 'AKTIE',
				 'QUALLE',
				 'KORREKTUR',
				 'MARATHONLAUF',
				 'PFERDERENNEN',
				 'ORCHESTER',
				 'NATURKATASTROPHE',
				 'ZINSSATZ',
				 'ADVENT',
				 'KAPITAL',
				 'POST',
				 'DATENBANK',
				 'NETZWERKUMGEBUNG',
				 'ZWISCHENZEIT',				
				 'PFANNE',
				 'MAUSTASTE',
				 'HANDBUCH',
				 'ZUSAMMENSETZUNG',
				 'SHANGHAI',
				 'CHINA',
				 'VITAMINE',
				 'MAUS',
				 'FEUERWEHR',
				 'FUSSBALL',
				 'STRASSENLATERNE',
				 'PROTOKOLL',
				 'ELECTRONIC',
				 'LOKOMOTIVE',
				 'BASEL',
				 'SCHWEIZ',
				 'KALENDER',
				 'DRUCKER',
				 'AUTOBAHN',
				 'BANGKOK',
				 'TELEFON',
				 'KREDITOR',
				 'BEARBEITUNG',
				 'ZYLINDERROLLENLAGER',
				 'SEGELFLUGZEUG',
				 'MOTORFLUGZEUG',
				 'FEUER',
				 'ANANAS',
				 'HANGMAN',
				 'HALLO',
				 'WEISSWEIN',
				 'OBERAFFENGEIL',
				 'SCHLAGERFORUM',
				 'KILOMETER',
				 'WURSTSALAT',
				 'WANDERGESELLE',
				 'NASHORNAUGEN',
				 'UNIKAT',
				 'WORT',
				 'POLIZEI',
				 'SCHWARZMARKT',
				 'PENISOPERATION',
				 'TAKTFRQUENZ',
				 'LOEFFEL',
				 'MAISKOLBEN',
				 'MAUSZEIGER',
				 'UNSINN',
				 'KIPPE',
				 'DRUCKERANSCHLUSS',
				 'BIER',
				 'BIERFASS',
				 'FAHRRADSATTELTASCHE',
				 'BUNDESRAT',
				 'TATSACHE',
				 'PUSTEKUCHEN',
				 'KIRSCHKERNWEITSPUCKWETTBEWERB',
				 'KOSTENVORANSCHLAG',
				 'PILLERMANN',
				 'ARSCHGESICHT',
				 'COMPUTERDATENBANKZUSATZSPEICHER'];

	function guessLetter(guess, sender){
		var output = '';
		var currentWordArray = currentWord.split("");
		var foundChar = 0;
		
		if(buyVowel(sender, guess)){
			if (currentWord.includes(guess)){
				for(i = 0; i < currentWordArray.length; i++){
					if((currentWordArray[i] == guess) && (guessedWord[i] != guess)){
						guessedWord[i] = guess;
						foundChar++;
					} else {
						if (guessedWord[i] == guess) {
							foundChar = -1;
						}
					}
				}
			}

		
			for(i=0; i < currentWord.split("").length; i++){
				output += guessedWord[i];
			}
			
			if (foundChar > 0) {
				var winnings = foundChar * prize;
				var guessString = foundChar > 1 ? guess + '\'s' : guess;
				
				$.say($.lang.get('hangman.found.char', sender, foundChar, guessString, $.getPointsString(winnings)));
				$.say($.lang.get('hangman.guessed.word', output));
				$.inidb.incr('points', sender, winnings);
			} else if (foundChar < 0){
				$.say($.lang.get('hangman.already.guessed.char', guess));
			} else if (foundChar == 0) {
				guessCount++;
				var guessesLeft = parseInt(difficulty) - parseInt(guessCount);
				if (guessesLeft > 0){
					$.say($.lang.get('hangman.guess.wrong.letter', guess, guessesLeft, output));	
				} else {
					lose();
				}
				
			}
		}
	}
	
	function buyVowel(sender, letter){
		var vowels = ["a", "e", "i", "o", "u"];
		for (i=0; i < vowels.length; i++){
			if(letter == vowels[i]){
				if ($.getUserPoints(sender) >= vowelCost){
					$.say($.lang.get('hangman.buy.vowel', sender, $.getPointsString(vowelCost)));
					$.inidb.decr('points', sender, vowelCost);
					return true;
				} else {
					$.say($.lang.get('hangman.buy.vowel.cant.afford', sender, $.getPointsString(vowelCost)));
					return false;
				}
			}
		}
		return true;
	}
	
	function lose(){
		$.say($.lang.get('hangman.loss', currentWord));
		guessCount = 0;
		currentWord = '';
	}
	
	function guessWord(guess, sender){
		if (guess == currentWord) {
			var playerPrize = (difficulty - guessCount) * prize;
			$.say($.lang.get('hangman.victory', sender, $.getPointsString(playerPrize), $.getPointsString(prize)));
			for (i in $.users) {
				if($.users[i][0] != sender){
					$.inidb.incr('points', $.users[i][0].toLowerCase(), prize);
				} else {
					$.inidb.incr('points', $.users[i][0].toLowerCase(), playerPrize);
				}
            }
			guessCount = 0;
			currentWord = '';
		} else {
			guessCount++;
			var guessesLeft = parseInt(difficulty) - parseInt(guessCount);
			if (guessesLeft > 0){
				$.say($.lang.get('hangman.wrong.guess', guess, guessesLeft));	
			} else {
				lose();
			}
		}
	}

	function guessGuess(guess, sender){
		if (guess.length > 0){
			if(guess.length > 1){
				guessWord(guess, sender);
			} else {
				guessLetter(guess, sender);
			}
		} else {
			$.say($.lang.get('hangman.usage', sender, guess));
		}
	}
	
	function setWord(sender){
			var max = words.length;
			var output = '';
			var currentWordSplit = [];
			guessedWord = [];
			currentWord = words[$.randRange(0, max)].toLowerCase();
			currentWordSplit = currentWord.split("");
			guessCount = 0;
			difficulty = trueDifficulty;
			for (i=0; i < currentWordSplit.length; i++){
				output += isLetter(currentWordSplit[i]) ? '_' : currentWordSplit[i];
				guessedWord.push(isLetter(currentWordSplit[i]) ? '_' : currentWordSplit[i]);
			}
			$.say($.lang.get('hangman.start', sender, output));
	}
	
	function isLetter(c) {
		  return c.toLowerCase() != c.toUpperCase();
		}
	
	function addWord(sender, word){
		var duplicate = false;
		var i;
		
		for(i = 0; $.inidb.exists('hangmanWords', i); i++){
			if(inidb.get('hangmanWords', i) == word){
				$.say($.lang.get('hangman.word.duplicate', word));
				return;
			}
		}
		
		$.inidb.set('hangmanWords', i, word); // Creates/sets a value in the DB table. Creates the DB table if required.
		words.push(word.toString());
		$.say($.lang.get('hangman.word.added', sender, word));
	}
	
	function loadWords(){
		if (!$.inidb.exists('hangmanWords', 0)){
			for(i = 0; i < words.length; i++){
				$.inidb.set('hangmanWords', i, words[i].toLowerCase());
			}
		} else {
			for(i=0; $.inidb.exists('hangmanWords', i); i++){
				var word = inidb.get('hangmanWords', i);
				words.push(word.toString().toLowerCase());
			}
		}
	}
	
	$.bind('command', function(event) {
		var sender = event.getSender(),
		    command = event.getCommand(),
		    args = event.getArgs(),
		    action = args[0],
		    diff = args[1],
		    word = '';
		
			for(i=0; i < args.length; i++){
				word += args[i] + ' ';
			}
			word = word.trim();
		
		
		
		if (command.equalsIgnoreCase('guess')){
			if(currentWord != ''){
				guessGuess(word.toLowerCase(), sender);	
			} else {
				$.say($.lang.get('hangman.not.started'));
			}
		}
		
		if (command.equalsIgnoreCase('hangman')){
			if (action != 'difficulty'){
				if (currentWord == ''){
					setWord(sender);
					setTimeout(function(){ 
						if(currentWord != ''){
							lose();
						}
					}, (time * 60000));
				} else {
					$.say($.lang.get('hangman.already.playing'));
				}
			} else {
				if (!isNaN(parseInt(diff))){
					trueDifficulty = diff;
					$.say($.lang.get('hangman.set.diff.success', diff));
				} else {
					$.say($.lang.get('hangman.set.diff.usage'));
				}
			}
		}
		
		if (command.equalsIgnoreCase('hangmanadd')){
			if(word.length != 0){
				addWord(sender, word);
			} else {
				$.say($.lang.get('hangman.noword'));
			}
		}
		
	});

	$.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./games/hangman.js')) {
        	$.registerChatCommand('./games/hangman.js', 'hangman', 6);
        	$.registerChatCommand('./games/hangman.js', 'hangmanadd', 6);        	
        	$.registerChatCommand('./games/hangman.js', 'guess', 7);
        	loadWords();
        }
    });
})();
