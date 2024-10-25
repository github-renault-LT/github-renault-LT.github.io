const GAME = (function(params) {

  const HIDDEN_LETTER = "_";
  const MAX_TRIES = 7;

  let _currentWord;
  let _normalizedWord;
  let _displayedWord;
  let _tries = 0;
  let _wordsTotal = 0;
  let _wordsFound = 0;

  const _start = function() {
    _tries = 0;
    _currentWord = { w:"", d:""};

    let firstLetter = "";
    let lastLetter  = "";
    let found = false;

    while (!found) {
      _currentWord = DICTIONARY.getNextData();

      // set to uppercase and remove diacritics (accents)
      _normalizedWord = UTILS.removeDiacritics(_currentWord.w.toUpperCase());

      // first letter
      firstLetter = _normalizedWord.charAt(0);
      // last letter
      lastLetter = _normalizedWord.slice(-1);
      // displayed text
      _displayedWord = "";
      for (i = 0; i < _normalizedWord.length; i++) {
        if (_normalizedWord.charAt(i) == firstLetter) {
          _displayedWord += firstLetter;
        }
        else if (_normalizedWord.charAt(i) == lastLetter) {
          _displayedWord += lastLetter;
        }
        else if (_normalizedWord.charAt(i) == "-") {
          // hyphen letter, always display
          _displayedWord += "-";
        }
        else if (_normalizedWord.charAt(i) == " ") {
          // space letter, always display
          _displayedWord += " ";
        }
        else if (_normalizedWord.charAt(i) == "'") {
          // apostrophe letter, always display
          _displayedWord += "'";
        }
        else {
          _displayedWord += HIDDEN_LETTER;
        }
      }
      // is there any _ in the text
      if (_displayedWord.indexOf(HIDDEN_LETTER) != -1) {
        found = true;
      }
    }

    // enable all keyboard keys, except first and last letter ones
    let keyboardKey;
    let keyboardKeyId;
    for (i = 0; i < 26; i++) {
      keyboardKeyId = "key"+String.fromCharCode(i + 65);
      keyboardKey = document.getElementById(keyboardKeyId);
      if ((keyboardKeyId == "key"+firstLetter) || (keyboardKeyId == "key"+lastLetter)) {
        keyboardKey.className = "keyDisabled";
        keyboardKey.removeEventListener("click", _proceedKey, false);
      }
      else {
        keyboardKey.className = "key";
        keyboardKey.addEventListener("click", _proceedKey, false);
      }
    }

    // disable play key
    keyboardKey = document.getElementById("keyPlay");
    keyboardKey.className = "keyDisabled";
    keyboardKey.removeEventListener("click", _start, false);

    // enable stop key
    keyboardKey = document.getElementById("keyStop");
    keyboardKey.className = "key";
    keyboardKey.addEventListener("click", _stop, false);

    _displayWord(_displayedWord);
    _clearDefinition();
    // should be 0
    _drawGibbet(_tries);
  }

  const _stop = function() {
    let hmiMessages = i18n.getData();
    HMI.showConfirmBox(
      hmiMessages.stopGameMessageBox.Title,
      hmiMessages.stopGameMessageBox.Content,
      hmiMessages.yes,
      hmiMessages.no,
      _stopGameConfirmed,
      HMI.closeConfirmBox
    );
  }

  const _stopGameConfirmed = function() {
    _disableKeyboard();
    _currentWord = { w:"", d:""};
    _displayedWord = "";
    _displayWord(_displayedWord);
    HMI.closeConfirmBox();
  }

  const _disableKeyboard = function(disablePlayKey) {
    let i;
    let keyboardKey;

    // disable all keys A-Z
    for (i = 0; i < 26; i++) {
      keyboardKey = document.getElementById("key"+String.fromCharCode(i + 65));
      keyboardKey.className = "keyDisabled";
      keyboardKey.removeEventListener("click", _proceedKey, false);
    }

    // enable or disable play key
    keyboardKey = document.getElementById("keyPlay");
    if (disablePlayKey == true) {
      keyboardKey.className = "keyDisabled";
      keyboardKey.removeEventListener("click", _start, false);
    }
    else {
      keyboardKey.className = "key";
      keyboardKey.addEventListener("click", _start, false);
    }

    // disable stop key
    keyboardKey = document.getElementById("keyStop");
    keyboardKey.className = "keyDisabled";
    keyboardKey.removeEventListener("click", _stop, false);
  }

  const _proceedKey = function() {
    //"use strict";
    // get the letter from the id key
    let letter = this.id.slice(-1);

    // is this letter in the word ?
    if (_normalizedWord.indexOf(letter) < 0) {
      // TODO - draw hangman
      //alert('nope');
      _tries++;
      _drawGibbet(_tries);
    }
    else {
      //alert('displayedWord=' + displayedWord);
      for (i = 0; i < _displayedWord.length; i++) {
        if (_normalizedWord.charAt(i) == letter) {
          _displayedWord = UTILS.replaceCharAt(_displayedWord, i, letter);
        }
      }
    }
    // update the display
    _displayWord(_displayedWord);

    // disable the key from the keyboard
    this.className = "keyDisabled";
    this.removeEventListener("click", _proceedKey, false);

    // check if the word has been found
    if (_displayedWord.indexOf(HIDDEN_LETTER) < 0) {
      // ok, the word has been found

      // disable keyboard
      _disableKeyboard(true);

      // display definition
      _displayDefinition();

      // show congratulation message
      HMI.showMessageBox(true, _tries);

      _wordsTotal++;
      _wordsFound++;
      _updateScore();
    }
    else {
      if (_tries > MAX_TRIES) {
        // ok, the word has not been found

        // disable keyboard
        _disableKeyboard(true);

        // display word
        _displayWord(_normalizedWord);

        // display definition
        _displayDefinition();

        // show unsuccessfull message
        HMI.showMessageBox(false, _tries);

        _wordsTotal++;
        _updateScore();
      }
    }
  }

  const _updateScore = function() {
    document.getElementById(HMI.ids.ELEMENT_SCORE_ID).innerHTML = "Score : " + _wordsFound + " / " + _wordsTotal;
    PARAMETERS.storeScore(_wordsFound, _wordsTotal, true);
  }

  const _displayWord = function(data) {
    document.getElementById(HMI.ids.ELEMENT_WORD_ID).innerHTML = data;
  }

  const _displayDefinition = function() {
    document.getElementById(HMI.ids.ELEMENT_DEFINITION_ID).innerHTML = _currentWord.d;
  }

  const _clearDefinition = function() {
    document.getElementById(HMI.ids.ELEMENT_DEFINITION_ID).innerHTML = "";
  }

  const _clearScoreCallback = function() {
    _wordsFound = 0;
    _wordsTotal = 0;
    _updateScore();
    HMI.closeConfirmBox();
  }

  const _confirmClearScore = function() {
    let hmiMessages = i18n.getData();
    HMI.showConfirmBox(
      hmiMessages.clearScoreMessageBox.Title,
      hmiMessages.clearScoreMessageBox.Content,
      hmiMessages.yes,
      hmiMessages.no,
      _clearScoreCallback,
      HMI.closeConfirmBox
    );
  }

  const _drawGibbet = function(howManyTries) {
    HMI.crossFadeMultipleImages("drawing", howManyTries);
  }

  const _initialize = function(params) {
    HMI.setLayout(params);
    HMI.initializeFader();
    i18n.initializeHmiMessages(PARAMETERS.getLanguage());

    DICTIONARY.initialize({base_dir: "dictionaries", list: "_index.json"})
    DICTIONARY.buildDictionariesSelector('#dictionaries-selector', true);

    const score = PARAMETERS.getScore();
    if ((score.found != null) && (score.total != null)) {
      _wordsFound = score.found;
      _wordsTotal = score.total;
    }

    // W3C
    document.getElementById(HMI.ids.ELEMENT_FADER_ID).addEventListener("animationend", HMI.onFaderAnimationEnd, false);
    document.getElementById(HMI.ids.ELEMENT_MESSAGE_BOX_ID).addEventListener("animationend", HMI.onMessageBoxAnimationEnd, false);
    document.getElementById(HMI.ids.ELEMENT_CONFIRM_BOX_ID).addEventListener("animationend", HMI.onConfirmBoxAnimationEnd, false);

    // fucking old webkit !
    /*
    document.getElementById(HMI.ids.ELEMENT_FADER_ID).addEventListener("webkitAnimationEnd", HMI.onFaderAnimationEnd, false);
    document.getElementById(HMI.ids.ELEMENT_MESSAGE_BOX_ID).addEventListener("webkitAnimationEnd", HMI.onMessageBoxAnimationEnd, false);
    document.getElementById(HMI.ids.ELEMENT_CONFIRM_BOX_ID).addEventListener("webkitAnimationEnd", HMI.onConfirmBoxAnimationEnd, false);
    */

    //document.getElementById(ELEMENT_DEFINITION_ID).innerHTML = "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus";
  }

  return {
    initialize: _initialize,
    start: _start,
    stop : _stop,
    disableKeyboard: _disableKeyboard,
    confirmClearScore: _confirmClearScore
  }

})();